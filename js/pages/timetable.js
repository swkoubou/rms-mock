
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

Vue.component('fixed-area', {
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
            <button class="btn btn-default" @click="" data-toggle="tooltip" title="必修科目をすべて選択">
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
            <button class="btn btn-default" @click="" data-toggle="tooltip" title="必修科目をすべて選択">
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
    </div>`,
  data() {
    return {
      year: '1年',
      section: '後期'
    };
  },
});

const toSeason = month => {
  month = (typeof month === 'number') ? month : ((new Date()).getMonth() + 1);
  return (3 <= month && month <= 8) ? 0 : 1;
};

const FIRST_SEASON = 1;
const SECOND_SEASON = 2;

Vue.component('lecture', {
  props: ['timetable', 'time', 'week', 'season'],
  data() {
    return {
      secondPeriodMode: false, // 後期モード（前期履修済科目に対応する）
      subject: this.$root.findSubject(this.timetable.subject_id)
    };
  },
  watch: {
    active(val) {
      this.$emit('update', this.timetable, this.subject, val);
    }
  },
  template: `
    <li class="timetable-view__subject" :class="{
            'timetable-view__subject--active': active,
            'timetable-view__subject--non-active': !active,
            'timetable-view__subject--required': subject.registration_type_id === 1,
            'timetable-view__subject--elective': subject.registration_type_id === 3,
            'timetable-view__subject--elective-required': subject.registration_type_id === 2,
            'timetable-view__subject--re-required': timetable.retake
        }"
        v-if="season === timetable.season"
        >
        <span class="timetable-view__subject-name"
            v-show="visible"
            @click="toggleActive">
            {{subject.name}}
            <span v-if="subject.registration_type_id === 5 || subject.registration_type_id === 6"
                class="timetable-view__subject--limited">
                (履修制限)
            </span>
            <span class="timetable-view__subject--recommend"
                v-if="subject.registration_type_id === 7">
                (推奨)
            </span>
        </span>
        <a class="timetable-view__detail-icon glyphicon glyphicon-info-sign"
            @click.stop
            :href="detailLink"
            aria-hidden="true"
            target="_brank"
            >
        </a>
    </li>`,
  computed: {
    visible() {
      if (!this.secondPeriodMode) {
        return true;
      }
      // return this.subject.timetable.season !== 2 || x.season !== 1 || x.state() !== 2;
    },
    active() {
      return this.timetable.active;
    },
    detailLink() {
      let path = window.location.href;
      path = path.replace('/timetable', '');
      return `${path}/subjectlist/${this.subject.subject_id}`;
    }
  },
  created() {
    // XXX: 各timetableのtimetable情報に対してactiveかの情報をreactiveにする
    this.subject.timetable.forEach(t => {
      this.$set(t, 'active', !!t.active);
    });
  },
});

Vue.component('lectures-cell', {
  props: {
    timetables: {
      type: Array,
      default: () => []
    },
    time: Number,
    week: Number,
    season: Number
  },
  data() {
    return {
      grade: this.$root.grade,
      // 必選別でソート
      sortedTimetable: this.timetables.sort((x, y) => {
        // 再履修は一番下
        // （選択）必修科目が優先
        if (x.retake - y.retake !== 0) {
          return x.retake > y.retake;
        } else {
          const xSubject = this.$root.findSubject(x.subject_id);
          const ySubject = this.$root.findSubject(y.subject_id);
          return xSubject.registration_type_id > ySubject.registration_type_id;
        }
      })
    };
  },
  template: `
    <ul class="timetable-view__lecture-list" :class="{'timetable-view__lecture-list--active': select}">
        <lecture :timetable="lecture" v-for="lecture in normalLecture" :time="time" :week="week" @update="exclude" :season="season" />
        <li v-show="existLowerLecture" class="timetable-view__small-heading">(下位学年科目)</li>
        <lecture :timetable="lecture" v-for="lecture in lowerLecuture" :time="time" :week="week" @update="exclude" :season="season" />

    </ul>`,
  computed: {
    select() {
      return this.sortedTimetable.some(timetable => timetable.active);
    },
    lowerLecuture() {
      return this.sortedTimetable.filter(timetable => {
        return timetable.grade < this.grade;
      });
    },
    existLowerLecture() {
      return this.lowerLecuture.length > 0;
    },
    normalLecture() {
      return this.sortedTimetable.filter(timetable => {
        return timetable.grade === this.grade;
      });
    }
  },
  methods: {

  },
});

Vue.component('timetable', {
  props: {
    timetables: {
      type: Array
    },
    season: Number
  },
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
                            <lectures-cell v-if="timetables.length" :timetables="timetables" :week="day" :time="t" :season="season" />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>`,
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
    // filters: {
    //   season(subjects, season) {
    //     return subjects.map(subject => {
    //       return subject.timetable.filter(timetable => {
    //         return timetable.season === season;
    //       });
    //     }).reduce((res, timetables) => res.concat(timetables), []);
    //   }
    // },
    components: {
      'color-meaming': colorMeaming,
      // 'fixed-area': fixedArea
    }
  })

