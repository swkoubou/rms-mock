new Vue({
    el: '#contains',
    data: {
        graduation: null,
        research1: null,
        research2: null,
        totalCredit: 0,
        promise: null
    },
    created() {
        this.promise = $.getJSON('../js/json/requirement.json')
        console.log(this.promise);
    },
});