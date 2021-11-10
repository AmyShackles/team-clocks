const teamMates = [
    { name: "Amy", timezone: "US/Pacific", clockType: "digital" },
    {
        name: `Agus
        Brashan
        Mati
        Román`,
        timezone: "America/Argentina/Buenos_Aires",
        clockType: "digital",
    },
    {
        name: "Mark",
        timezone: "US/Eastern",
        clockType: "analog",
        militaryTime: true,
    },
];

const clocks = init(teamMates);
console.log(clocks);

window.requestAnimationFrame(makeClocks);
