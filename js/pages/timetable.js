import Vue from 'vue';
import $ from 'jquery';
// import * as util from '../Module/util';

import timetable from '../Components/Timetable';
import fixedArea from '../Components/FixedArea';
import colorMeaning from '../Components/ColorMeaming';

export const toSeason = month => {
  month = (typeof month === 'number') ? month : ((new Date()).getMonth() + 1);
  return (3 <= month && month <= 8) ? 0 : 1;
};

const FIRST_SEASON = 1;
const SECOND_SEASON = 2;

new Vue({
    el: '#contents',
    data: {
      firstMaxCredit: 26,
      secondMaxCredit: 26,
      subjects: [],
      currentSeason: toSeason(),
      grade: 2,
      originalTimetables: [],
    },
  mounted() {
      //　ライフサイクルフック(インスタンスが生成された後)
      var subjectPromise = $.getJSON('../js/json/subject.json');
      var optionPromise = $.getJSON('../js/json/account.json');
      $.when(subjectPromise, optionPromise).then(([subjects], [option]) => {
        this.subjects = subjects.filter(subject => {
          return subject.state !== 3;
        });
        // Save用のやつ
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
    filters: {
      season(subjects, season) {
        return subjects.map(subject => {
          return subject.timetable.filter(timetable => {
            return timetable.season === season;
          });
        }).reduce((res, timetables) => res.concat(timetables), []);
      }
    },
    components: {
      'color-meaming': colorMeaning,
      timetable,
      'fixed-area': fixedArea
    }
  })

