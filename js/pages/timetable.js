// var timetable = require();

var colorMeaming = {
  template: `<div class="alert alert-info">
            <dl class="color-meaning">
                <dt>履修状況</dt>
                <dd class="color-meaning__non-active">未履修</dd>
                <dd class="color-meaning__item--active">履修中</dd>
                <dt>必選別</dt>
                <dd class="color-meaning__item--required">必修</dd>
                <dd class="color-meaning__item--elective-required">選択必修</dd>
                <dd class="color-meaning__item--elective">選択・任意</dd>
                <dd class="color-meaning__item--re-required">特別授業</dd>
            </dl>
        </div>`
};


new Vue({
    el: '#contents',
    data: {
      firstMaxCredit: 26,
      secondMaxCredit: 26,
      subjects: [],
    },
    components: {
      'color-meaming': colorMeaming
    }
  })
