import _ from 'lodash';

const template = `
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
</li>
`;

export default {
  props: ['timetable', 'time', 'week', 'season'],
  template,
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
  methods: {
    toggleActive() {
      this.timetable.active = !this.timetable.active;
    }
  }
};