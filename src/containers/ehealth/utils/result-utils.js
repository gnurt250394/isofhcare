module.exports = {
    checkHighlight(result, min, max) {
        try {
            if (result && result.toLowerCase() == "dương tính")
                return true;
            result = parseFloat(result);
            min = parseFloat(min);
            max = parseFloat(max);
            if (result < min || result > max)
                return true;
            return false;
        } catch (error) {
            return false;
        }
    },
    showHighlight(item) {
        if (item.NormalRange) {
            if (!item.ResultState)
                return false;
            else {
                if (item.ResultState != "N")
                    return true;
            }
            return false;
        }
        return this.checkHighlight(this.getResult(item), item.Conclusion, item.LowerIndicator, item.HigherIndicator);
    },
    getResult(item) {
        return item.Result ? item.Result : item.Conclusion;
    },
    getRangeMedicalTest(item2) {
        if (item2.NormalRange)
            return item2.NormalRange;
        var range = "";
        if (item2.LowerIndicator && item2.HigherIndicator)
            range = item2.LowerIndicator + " - " + item2.HigherIndicator;
        else {
            range = item2.LowerIndicator;
            if (item2.HigherIndicator)
                range = item2.HigherIndicator;
        }
        return range;
    }
}