
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

const toSeason = month => {
  month = (typeof month === 'number') ? month : ((new Date()).getMonth() + 1);
  return (3 <= month && month <= 8) ? 0 : 1;
};

const FIRST_SEASON = 1;
const SECOND_SEASON = 2;

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
      currentSeason: 0,
      grade: 2,
      originalTimetables: [],
    },
    created: function () {
      //　ライフサイクルフック(インスタンスが生成された後)
      var subjectPromise = $.getJSON('../js/json/subject.json');
      var optionPromise = $.getJSON('../js/json/account.json');
      console.log(subjectPromise);
      $.when(subjectPromise, optionPromise).then(([subjects], [option]) => {
        this.subjects = subjects.filter(subject => {
          return subject.state !== 3;
        });
        // Save用のやつ
        // this.originalTimetables = this.subjects
        //   .map(subject => subject.timetable)
        //   .reduce((memo, timetables) => {
        //     timetables = timetables.map(timetable => {
        //       return {
        //         active: !!timetable.active,
        //         subject_id: timetable.subject_id
        //       };
        //     });
        //     return memo.concat(timetables);
        //   }, []);
        console.log(this.subjects);
        this.firstMaxCredit = option.first_cap_over;
        this.secondMaxCredit = option.second_cap_over;
      });
    },
    methods: {

    },
    computed: {
      firstCredit() {
        return this.subjects.reduce((memo, subject) => {
          const includedCap = subject.included_cap;
          const anyActive = subject.timetable.some(timetable => {
            return timetable.season === FIRST_SEASON &&
              timetable.active;
          })
          if (includedCap && anyActive)
            memo += subject.credit;
            console.log(memo);
          return memo;
        }, 0);
      },
      secondCredit() {
        return this.subjects.reduce((memo, subject) => {
          const includedCap = subject.included_cap;
          const anyActive = subject.timetable.some(timetable => {
            return timetable.season === SECOND_SEASON &&
              timetable.active;
          })
          if (includedCap && anyActive)
            memo += subject.credit;
          return memo;
        }, 0);
      },
      totalCredit() {
        return this.firstCredit + this.secondCredit;
      },
      totalMaxCredit() {
        return this.firstMaxCredit + this.secondMaxCredit - 4;
      },

      // 単位数オーバーの算出
      firstCreditOver() {
        return this.firstCredit > this.firstMaxCredit;
      },
      secondCreditOver() {
        return this.secondCredit > this.secondMaxCredit;
      },
      totalCreditOver() {
        return this.totalCredit > this.totalMaxCredit;
      },
      creditOver() {
        return this.firstCreditOver || this.secondCreditOver || this.totalCreditOver;
      },
      timetableStateArray() {
        return this.subjects
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
      },
      changeState() {
        return !_.isEqual(this.originalTimetables, this.timetableStateArray);
      },
      disabledButton() {
        // CAPオーバーしている場合や
        // 元の配列と同一な場合は保存ボタンを有効にする必要がない
        return this.creditOver || !this.changeState;
      }
    },
    filters: {
      season(subjects, season = 0) {
        return subjects.map(subject => {
          return subject.timetable.filter(timetable => {
            return timetable.season === season;
          });
        }).reduce((res, timetables) => res.concat(timetables), []);
      }
    },
    components: {
      'color-meaming': colorMeaming,
      // 'fixed-area': fixedArea
    }
  })

