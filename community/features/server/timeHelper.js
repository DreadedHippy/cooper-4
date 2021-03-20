import moment from 'moment';

export default class TimeHelper {

    static secsLongFmt(secs) {
        const secsMoment = moment.unix(secs);
        return secsMoment.format('dddd, MMMM Do YYYY, h:mm:ss a');
    }

    static humaniseSecs(secs) {
        const humanRemaining = moment.duration(secs * 1000).humanize();
        return humanRemaining;
    }

    static _secs() {
        const presentSecs = Math.round(Date.now() / 1000);
        return presentSecs;
    }
}