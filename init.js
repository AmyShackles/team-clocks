let defaultClockOptions = {
    clockFaceColor: "rgb(255, 255, 255, 0.3)",
    secondHandPointColor: "rgba(0, 0, 0, 0)",
    clockOutlineColor: "black",
    secondHandColor: "rebeccapurple",
    minuteHandColor: "black",
    hourHandColor: "black",
    minuteMarksColor: "black",
    hourMarkColor: "black",
    clockType: "digital",
};

function initOptions(options) {
    options = { ...defaultClockOptions, ...options };
    let root = document.documentElement;
    Object.entries(options).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
}

export function init(teamMates, options) {
    initOptions(options);
    const teamMateContainer = document.createElement("div");
    teamMateContainer.setAttribute("class", "teamMateContainer");
    return teamMates.map(
        ({ name, timezone, clockType, militaryTime = false }) => {
            const teamMateClock = document.createElement("div");
            teamMateClock.setAttribute("class", "teamMateClock");

            let teamMemberLabel = document.createElement("p");
            teamMemberLabel.innerText = name;
            teamMemberLabel.setAttribute("class", "teamMemberName");
            teamMateClock.append(teamMemberLabel);
            let timeZoneLabel = document.createElement("p");
            timeZoneLabel.setAttribute("class", "timezoneLabel");

            if (timezone) {
                timeZoneLabel.innerText = timezone
                    .match(/^.*?\/(.*)/)[1]
                    .replace("_", "");
            } else {
                timeZoneLabel.innerText = "Local Time";
            }
            teamMateClock.append(timeZoneLabel);
            let clock;
            if (clockType === "digital") {
                clock = document.createElement("div");
                clock.setAttribute("class", "clock digitalClock");
                clock.setAttribute("data-timezone", timezone);
                clock.setAttribute("data-clockType", "digital");
                clock.setAttribute("data-militaryTime", militaryTime);
                const hour = document.createElement("p");
                hour.setAttribute("class", "hour");
                const firstSeparator = document.createElement("p");
                firstSeparator.setAttribute("class", "separator");
                firstSeparator.innerText = ":";
                const minute = document.createElement("p");
                minute.setAttribute("class", "minute");
                const secondSeparator = document.createElement("p");
                secondSeparator.setAttribute("class", "separator");
                secondSeparator.innerText = ":";
                const second = document.createElement("p");
                second.setAttribute("class", "second");
                const amPM = document.createElement("p");
                amPM.setAttribute("class", "amPM");
                clock.appendChild(hour);
                clock.appendChild(firstSeparator);
                clock.appendChild(minute);
                clock.appendChild(secondSeparator);
                clock.appendChild(second);
                clock.appendChild(amPM);
            } else {
                clock = document.createElement("canvas");
                clock.setAttribute("class", "clock analogClock");
                clock.setAttribute("data-timezone", timezone);
                clock.setAttribute("data-clockType", "analog");
                clock.setAttribute("height", "300px");
                clock.setAttribute("width", "300px");
            }
            teamMateClock.append(clock);
            teamMateContainer.append(teamMateClock);
            document.body.append(teamMateContainer);
            return { clock, clockType, militaryTime, timezone };
        }
    );
}

export function createClock(
    ctx,
    clock,
    now,
    militaryTime,
    options = defaultClockOptions
) {
    const clockType = clock.getAttribute("data-clocktype");
    if (clockType === "digital") {
        createDigitalClock(clock, now, militaryTime);
    } else {
        createAnalogClock(ctx, now, options);
    }
}

function createDigitalClock(clock, now, militaryTime) {
    var sec = now.getSeconds();
    sec = sec < 10 ? "0" + sec : sec;
    var min = now.getMinutes();
    min = min < 10 ? "0" + min : min;
    const rawHr = now.getHours();
    let hr;
    if (militaryTime) {
        hr = rawHr < 10 ? "0" + rawHr : rawHr;
    } else {
        hr = rawHr > 12 ? `${rawHr - 12} PM` : rawHr;
        hr = rawHr < 10 ? "0" + rawHr : rawHr;
    }
    const hour = clock.querySelector(".hour");
    const minute = clock.querySelector(".minute");
    const second = clock.querySelector(".second");
    const amPM = clock.querySelector(".amPM");
    hour.innerText = hr;
    minute.innerText = min;
    second.innerText = sec;
    amPM.innerText = rawHr > 12 ? "PM" : "AM";
}

function createAnalogClock(ctx, now, options = defaultClockOptions) {
    ctx.save();
    ctx.clearRect(0, 0, 300, 300);
    ctx.translate(150, 150);
    ctx.scale(1, 1);
    ctx.rotate(-Math.PI / 2);
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    // Hour marks
    ctx.save();
    for (var i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.rotate(Math.PI / 6);
        ctx.moveTo(100, 0);
        ctx.lineTo(120, 0);
        ctx.strokeStyle = options.hourMarkColor;
        ctx.stroke();
    }
    ctx.restore();

    // Minute marks
    ctx.save();
    ctx.lineWidth = 5;
    for (i = 0; i < 60; i++) {
        if (i % 5 != 0) {
            ctx.beginPath();
            ctx.moveTo(117, 0);
            ctx.lineTo(120, 0);
            ctx.strokeStyle = options.minuteMarkColor;
            ctx.stroke();
        }
        ctx.rotate(Math.PI / 30);
    }
    ctx.restore();

    var sec = now.getSeconds();
    var min = now.getMinutes();
    var hr = now.getHours();
    hr = hr >= 12 ? hr - 12 : hr;

    // write Hours
    ctx.save();
    ctx.rotate(
        hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) * sec
    );
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(80, 0);
    ctx.strokeStyle = options.hourHandColor;
    ctx.stroke();
    ctx.restore();

    // write Minutes
    ctx.save();
    ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-28, 0);
    ctx.lineTo(112, 0);
    ctx.strokeStyle = options.minuteHandColor;
    ctx.stroke();
    ctx.restore();

    // Write seconds
    ctx.save();
    ctx.rotate((sec * Math.PI) / 30);
    ctx.strokeStyle = options.secondHandColor;
    ctx.fillStyle = options.secondHandColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(83, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fillStyle = options.secondHandPointColor;
    ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = options.clockOutlineColor;

    ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
    ctx.fillStyle = options.clockFaceColor;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

export function getTimeZone(timeZone) {
    if (timeZone) {
        let options = {
                timeZone,
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            },
            toTimeZone = new Intl.DateTimeFormat([], options);
        return new Date(toTimeZone.format(new Date()));
    } else {
        return new Date(Date.now());
    }
}
