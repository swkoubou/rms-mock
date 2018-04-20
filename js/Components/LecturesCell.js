import lecture from './Lecture';

const template = `
<ul class="timetable-view__lecture-list" :class="{
        'timetable-view__lecture-list--active': select
    }">
    <lecture :timetable="lecture" v-for="lecture in normalLecture" :time="time" :week="week" @update="exclude" :season="season" />
    <li v-show="existLowerLecture" class="timetable-view__small-heading">(下位学年科目)</li>
    <lecture :timetable="lecture" v-for="lecture in lowerLecuture" :time="time" :week="week" @update="exclude" :season="season" />
</ul>`;

export default {
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
    template,
    mounted() {
        // 選択された要素が見えない場合、見えるようにスクロールする
        // let obj = $('.timetable-active');
        // $(obj).each(function () {
        //     $(this).parent().scrollTop($(this).offset().top - $(this).parent().offset().top);
        // });

    },
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
        exclude(clickedTimetable, clickedSubject, isActive) {
            // アクティブ化した時だけ、排他的処理などを行う
            if (isActive) {
                // セル内での排他的処理
                this.sortedTimetable
                    .filter(t => t.timetable_id !== clickedTimetable.timetable_id)
                    .forEach(t => {
                        const subject = this.$root.findSubject(t.subject_id);
                        this.resonance(subject, false);
                        t.active = false;
                    });
                this.exclusion(clickedTimetable, clickedSubject, false);
            }
            this.resonance(clickedSubject, isActive);
        },
        // 週時間数4時間以上の科目は、シーズン内で共鳴する。
        resonance(subject, active) {
            if (subject.times >= 4) {
                subject.timetable
                    .filter(timetable => this.season === timetable.season)
                    .forEach(timetable => timetable.active = active);
            }
        },
        // 週時間数4時間未満またはシーズン外の科目は、排他的処理をする。
        exclusion(clickedTimetable, subject, active) {
            if (subject.times < 4) {
                subject.timetable
                    .filter(timetable => timetable.timetable_id !== clickedTimetable.timetable_id)
                    .filter(timetable => {
                        return this.season !== timetable.season ||
                            timetable.week !== this.week ||
                            timetable.time !== this.time;
                    })
                    .forEach(timetable => timetable.active = active);
            }
        },
    },
    components: {
        lecture
    }
};