import moment from 'moment';

export default class TimeHelper {

    static secsLongFmt(secs) {
        const secsMoment = moment.unix(secs);
        return secsMoment.format('dddd, MMMM Do YYYY, h:mm:ss a');
    }

}