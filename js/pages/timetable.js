
var colorMeaming = {
  template: `
    <div class="alert alert-info">
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
    </div>
  `
};
var data = { 
  year: '1年',
  section: '後期'
 };
Vue.component('fixed-area', {
  // props: ['message'],
  template: `
    <div class="container">
        <div class="btn-group dropup" role="group">
            <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                {{year}}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
              <li role="presentation"><a role="menuitem">1年</a></li>
              <li role="presentation"><a role="menuitem">2年</a></li>
              <li role="presentation"><a role="menuitem">3年</a></li>
              <li role="presentation"><a role="menuitem">4年</a></li>
            </ul>
          </div>
          <div class="btn-group dropup" role="group">
            <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                {{section}}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
              <li role="presentation"><a role="menuitem">前期</a></li>
              <li role="presentation"><a role="menuitem">後期</a></li>
            </ul>
        </div>
        <!-- <div class="btn-group">
            <button class="btn btn-default" @click="changeActiveAllRequired" data-toggle="tooltip" title="必修科目をすべて選択">
                    <span class="glyphicon glyphicon-plus-sign"></span> 必修科目をすべて選択
            </button>
            <div class="btn-group dropup" role="group">
                <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                    <span class="glyphicon glyphicon-print"></span> 印刷
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
                <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printFirst') ?>">前期</a></li>
                <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printSecond') ?>">後期</a></li>
                <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('print') ?>">全期</a></li>
                </ul>
            </div>
        </div> -->

        <div class="relative pull-right">
          <div class="btn-group">
            <button class="btn btn-default" @click="changeActiveAllRequired" data-toggle="tooltip" title="必修科目をすべて選択">
              <span class="glyphicon glyphicon-plus-sign"></span> 必修科目をすべて選択
            </button>
            <div class="btn-group dropup" role="group">
              <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                  <span class="glyphicon glyphicon-print"></span> 印刷
                  <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
              <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printFirst') ?>">前期</a></li>
              <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printSecond') ?>">後期</a></li>
              <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('print') ?>">全期</a></li>
              </ul>
            </div>
          </div>
          <div class="btn-group">
              <button class="btn btn-danger"  data-toggle="modal" data-target="#reset_modal" title="リセット">
              <span class="glyphicon glyphicon-trash"></span> リセット
              </button>
              <button class="btn btn-primary"  data-toggle="modal" data-target="#reset_modal" title="保存">
                保存
              </button>
          </div>
        </div>
    </div>
  `,
  data: function () {
    return data
  },
});

Vue.component('timetable', {
  template: `
    <div class="table-responsive">
        <table class="table table-bordered timetable-view">
            <thead>
            <tr>
                <th class="timetable-view__heading timetable-view__heading--season timetable-view__heading--vertical">
                    {{season === 0 ? '前期' : '後期'}}
                </th>
                <th class="timetable-view__heading timetable-view__heading--vertical"
                    v-for="day in week">
                    {{day}}
                </th>
            </tr>
            </thead>
            <tbody>
                <template v-for="t in time">
                    <tr>
                        <th class="timetable-time timetable-view__heading timetable-view__heading--time">
                            {{t}}限
                        </th>
                        <td class="timetable-view__lecture-cell timetable-view__lecture"
                            v-for="day in week.length">
                            <!-- ｖ−ｉｆを利用することでsubjectsが降ってきてからmountできる -->
                            <lectures-cell v-if="timetables.length" :timetables="timetables | cell(t, day, season)" :week="day" :time="t" :season="season" />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
    `,
  data() {
    return {
      week: ['月', '火', '水', '木', '金', '土'],
      time: 5
    };
  },
});


new Vue({
    el: '#contents',
    data: {
      firstMaxCredit: 26,
      secondMaxCredit: 26,
      subjects: [],
      originalTimetables: [],
    },
  created: function () {
    //　ライフサイクルフック(インスタンスが生成された後)
    var subjectPromise = $.getJSON('../js/json/subject.json');
    var optionPromise = $.getJSON('../js/json/account.json');
    $.when(subjectPromise, optionPromise).then(([subjects], [option]) => {
      this.subjects = subjects.filter(subject => {
        return subject.state !== 3;
      });
      this.originalTimetables = this.subjects
        .map(subject => subject.timetable)
        .reduce((memo, timetables) => {
          timetables = timetables.map(timetable => {
            return {
              active: !!timetable.active,
              subject_id: timetable.subject_id
            };
          });
          return memo.concat(timetables);
        }, []);
      this.firstMaxCredit = option.first_cap_over;
      this.secondMaxCredit = option.second_cap_over;
    });
  },
  methods: {

  },
    components: {
      'color-meaming': colorMeaming,
      // 'fixed-area': fixedArea
    }
  })

