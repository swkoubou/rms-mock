import LecturesCell from './LecturesCell';

export default {
    props: {
        timetables: {
            type: Array
        },
        season: Number
    },
    data() {
        return {
            week: ['月', '火', '水', '木', '金', '土'],
            time: 5
        };
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
    filters: {
        cell(timetables, time, week, season) {
            return timetables.filter(timetable => {
                return timetable.time === time &&
                    timetable.week === week &&
                    timetable.season === season;
            });
        }
    },
    components: {
        LecturesCell
    },
}