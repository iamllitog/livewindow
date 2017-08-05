module.exports = {
    toNormalNumber (numStr) {
        numStr = numStr.trim();
        if (numStr.substr(numStr.length-1,1) === '万'){
            return Number(numStr.substr(0,numStr.length-1)) * 10000;
        }

        return Number(numStr);
    }
};