var DClock = {
    "muted" : 0,
    "nextUtterance" : '', 
    "previousUtterance" : '',
    "utteranceCount" : 0, 
    "dateString" : '',
    "timeString" : '',
    "voices" : [],
    "voice" : '',

    init : function() {
        this.update();
        if (!this.muted)
            this.speak();

        // wait on voices to be loaded before fetching list
        window.speechSynthesis.onvoiceschanged = function() {
            if (DClock.voices.length > 0) {
                DClock.voice = DClock.voices.filter(function(voice) { return voice.name == 'Google UK English Female'; })[0]

                var output = DClock.voices.map(function(voice) { return voice.name /* voice.toString */; }).join('<br/>');
                var display = document.getElementById('voices');
                display.innerHTML = output;
            }
        };
    },

    getVoiceList : function() {
        if (DClock.voices.length == 0)
        {
            DClock.voices = window.speechSynthesis.getVoices();
        }
    },

    getSpokenDateString : function() {
        var weekday, month, day, year;
        var hour, minute, ampm;
        var date = new Date();
        hour = date.getHours();
        minute = date.getMinutes();

        if ((minute % 15) > 0 && this.utteranceCount > 0)
            return '';

        if (hour < 6)
            ampm = " in the early morning";
        else if (hour < 12)
            ampm = " in the morning";
        else if (hour < 18)
            ampm = " in the afternoon";
        else if (hour < 21)
            ampm = " in the evening";
        else 
            ampm = " at night"

        if (hour == 0)
            hour = 12;
        else if (hour > 12)
            hour -= 12;

        if (minute < 10)
            minute = "0" + minute;

        this.utteranceCount += 1;
        return "Today is " + date.toDateString() + " and it is now " + hour  + ":" + minute + ampm + ".";
    },

    getWrittenDateString : function() {
        var weekday, month, day, year;
        var hour, minute, ampm;
        var date = new Date();
        hour = date.getHours();
        minute = date.getMinutes();

        if (hour >= 12)
            ampm = " PM";
        else
            ampm = " AM";

        if (hour == 0)
            hour = 12;
        else if (hour > 12)
            hour -= 12;

        if (minute < 10)
            minute = "0" + minute;

        return "Today is " + date.toDateString() + " and it is now " + hour  + ":" + minute + ampm + ".";
    },

    speak : function() {
        if (this.nextUtterance != '' && this.nextUtterance != this.previousUtterance) {
            DClock.getVoiceList();
            window.speechSynthesis.cancel();
            this.utterance = new SpeechSynthesisUtterance(this.nextUtterance);
            if (DClock.voice)
                this.utterance.voice = DClock.voice;
            window.speechSynthesis.speak(this.utterance);
            this.previousUtterance = this.nextUtterance;
        }
    },

    update : function() {
        // since voices are loaded asynchronously, poll for them if they haven't been loaded yet
        if (DClock.voices.length == 0)
            DClock.getVoiceList();

        this.nextUtterance = this.getSpokenDateString();
        if (this.nextUtterance != '')
            this.speak();

        var display = document.getElementById('message');
        display.innerHTML = this.getWrittenDateString();

        setTimeout("DClock.update()", 10000);
    }
}

window.onload = function() {
    DClock.init();
};
