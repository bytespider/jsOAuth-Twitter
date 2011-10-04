SRC_DIR = src

PREFIX = .
DIST_DIR = ${PREFIX}/dist
BUILD_DIR = ${PREFIX}/build
SPEC_DIR = ${PREFIX}/spec

COMMONJS_DIR = ${DIST_DIR}/CommonJS
COMMONJS_LIB_DIR = ${COMMONJS_DIR}/lib
COMMONJS_TEST_DIR = ${COMMONJS_DIR}/tests

DEST_DIR = ${DIST_DIR}

SRC_FILES = ${SRC_DIR}/start.js \
	${SRC_DIR}/OAuth/Twitter.js \
	${SRC_DIR}/end.js \


VERSION = ${shell cat Version}
TIMESTAMP = ${shell git log -1 . | grep Date: | sed 's/.*: //g'}
REVISION = ${shell git rev-list --max-count=1 --all}

VER = sed 's/@VERSION/${VERSION}/'
DATE = sed 's/@DATE/${TIMESTAMP}/'
REV = sed 's/@REV/${REVISION}/'

JSOA_DEBUG = ${DIST_DIR}/jsOAuth_Twitter.js
JSOA_PRODUCTION = ${DIST_DIR}/jsOAuth_Twitter-${VERSION}.js
JSOA_PRODUCTION_MIN = ${DIST_DIR}/jsOAuth_Twitter-${VERSION}.min.js
JSOA_COMMONJS = ${COMMONJS_LIB_DIR}/jsOAuth_Twitter.js
JSOA_COMMONJS_ZIP = ${DIST_DIR}/jsOAuth_Twitter-${VERSION}.CommonJS.zip

all: jsoauth-twitter

jsoauth-twitter: ${DIST_DIR} ${JSOA_PRODUCTION} ${JSOA_PRODUCTION_MIN} ${JSOA_PRODUCTION_COMPILED}

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

${JSOA_DEBUG}: ${SRC_FILES} ${DIST_DIR}
	@@echo "Building" ${JSOA_DEBUG}

	@@cat ${SRC_FILES} | \
		${REV} | \
		${DATE} | \
		${VER} > ${JSOA_DEBUG}

	@@cat Readme.build | ${VER} > README.md

	@@echo "Build complete."
	@@echo ""

${JSOA_PRODUCTION}: ${JSOA_DEBUG}
	@@echo "Versioning" ${JSOA_PRODUCTION}
	@@echo "    Date:" ${TIMESTAMP}
	@@echo "    Revision:" ${REVISION}

	@@cat ${JSOA_DEBUG} > ${JSOA_PRODUCTION}

	@@echo "Vesioning complete."
	@@echo ""

${JSOA_PRODUCTION_MIN}: ${JSOA_PRODUCTION}
	@@echo "Uglifying ${JSOA_PRODUCTION} > ${JSOA_PRODUCTION_MIN}"
	@@curl --data-urlencode js_code@${JSOA_PRODUCTION} \
		-o ${JSOA_PRODUCTION_MIN} \
		http://marijnhaverbeke.nl/uglifyjs

	@@echo "Minification complete."
	@@echo ""

${JSOA_COMMONJS}: ${JSOA_PRODUCTION_MIN}
	@@echo "Building CommonJS / Node.JS module"
	@@mkdir -p ${COMMONJS_LIB_DIR}
	@@mkdir -p ${COMMONJS_TEST_DIR}
	@@cat ${JSOA_PRODUCTION_MIN} > ${JSOA_COMMONJS}
	@@cp ${SPEC_DIR}/test-* ${COMMONJS_TEST_DIR}/.
	@@cp ${SRC_DIR}/package.json ${COMMONJS_DIR}/.
	@@echo "Build complete."

commonjs-compress: ${JSOA_COMMONJS}
	@@echo "Compressing..."
	@@ditto -ck --sequesterRsrc --keepParent ${COMMONJS_LIB_DIR} ${JSOA_COMMONJS_ZIP}
	@@echo "Compression complete"

commonjs: ${JSOA_COMMONJS}

clean:
	@@echo "Removing Distribution directory: ${DIST_DIR}"
	@@rm -rf ${DIST_DIR}
	@@echo ""
