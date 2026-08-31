/* ==========================================
   MASJID AL-MUJAHIDIN DISPLAY
   LOCATION: JAKARTA TIMUR
   TIMEZONE: ASIA/JAKARTA
========================================== */


/* ==========================================
   PRAYER TIMES
   SEMENTARA

   Nantinya bagian ini bisa diganti API
   agar jadwal otomatis berubah setiap hari.
========================================== */

const prayerTimes = {
  fajr: "04:38",
  sunrise: "05:58",
  dhuhr: "11:57",
  asr: "15:14",
  maghrib: "17:56",
  isha: "19:05"
};


/* ==========================================
   PRAYER LIST
========================================== */

const prayers = [

  {
    id: "fajr",
    name: "SUBUH",
    time: prayerTimes.fajr
  },

  {
    id: "dhuhr",
    name: "ZUHUR",
    time: prayerTimes.dhuhr
  },

  {
    id: "asr",
    name: "ASAR",
    time: prayerTimes.asr
  },

  {
    id: "maghrib",
    name: "MAGRIB",
    time: prayerTimes.maghrib
  },

  {
    id: "isha",
    name: "ISYA",
    time: prayerTimes.isha
  }

];


/* ==========================================
   GET JAKARTA TIME
========================================== */

function getJakartaTime() {

  const now = new Date();

  const formatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Asia/Jakarta",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: false
      }
    );

  const time =
    formatter.format(now);

  const parts =
    time.split(":");

  return {
    hour: Number(parts[0]),
    minute: Number(parts[1]),
    second: Number(parts[2])
  };

}


/* ==========================================
   UPDATE CLOCK
========================================== */

function updateClock() {

  const now =
    new Date();


  /* JAM */

  const clock =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        timeZone: "Asia/Jakarta",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: false
      }
    ).format(now);

  document
    .getElementById("clock")
    .textContent = clock;


  /* HARI */

  const day =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        timeZone: "Asia/Jakarta",
        weekday: "long"
      }
    ).format(now);

  document
    .getElementById("day")
    .textContent =
      day.toUpperCase();


  /* TANGGAL MASEHI */

  const date =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        timeZone: "Asia/Jakarta",

        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(now);

  document
    .getElementById("date")
    .textContent =
      date.toUpperCase();


  /* TANGGAL HIJRIAH */

  const hijriDate =
    new Intl.DateTimeFormat(
      "id-ID-u-ca-islamic",
      {
        timeZone: "Asia/Jakarta",

        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(now);

  document
    .getElementById("hijri-date")
    .textContent =
      hijriDate.toUpperCase();


  updateNextPrayer();

}


/* ==========================================
   CONVERT TIME TO SECONDS
========================================== */

function timeToSeconds(time) {

  const parts =
    time.split(":");

  const hour =
    Number(parts[0]);

  const minute =
    Number(parts[1]);

  return (
    hour * 3600 +
    minute * 60
  );

}


/* ==========================================
   UPDATE NEXT PRAYER
========================================== */

function updateNextPrayer() {

  const current =
    getJakartaTime();


  const currentSeconds =
    current.hour * 3600 +
    current.minute * 60 +
    current.second;


  let nextPrayer = null;


  /* CARI SALAT BERIKUTNYA */

  for (const prayer of prayers) {

    const prayerSeconds =
      timeToSeconds(
        prayer.time
      );


    if (
      currentSeconds <
      prayerSeconds
    ) {

      nextPrayer = {
        ...prayer,

        seconds:
          prayerSeconds
      };

      break;

    }

  }


  /* JIKA SUDAH LEWAT ISYA
     MAKA BERIKUTNYA SUBUH BESOK */

  if (!nextPrayer) {

    const fajrSeconds =
      timeToSeconds(
        prayerTimes.fajr
      );


    nextPrayer = {

      id: "fajr",

      name: "SUBUH",

      time:
        prayerTimes.fajr,

      seconds:
        fajrSeconds +
        86400

    };

  }


  /* UPDATE TEXT */

  document
    .getElementById(
      "next-prayer-name"
    )
    .textContent =
      nextPrayer.name;


  document
    .getElementById(
      "next-prayer-time"
    )
    .textContent =
      nextPrayer.time;


  /* COUNTDOWN */

  let difference =
    nextPrayer.seconds -
    currentSeconds;


  if (difference < 0) {

    difference +=
      86400;

  }


  const hours =
    Math.floor(
      difference / 3600
    );


  const minutes =
    Math.floor(
      (
        difference % 3600
      ) / 60
    );


  const seconds =
    difference % 60;


  const formattedCountdown =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;


  document
    .getElementById(
      "countdown"
    )
    .textContent =
      formattedCountdown;


  /* HIGHLIGHT PRAYER */

  document
    .querySelectorAll(
      ".prayer-card"
    )
    .forEach(card => {

      card.classList.remove(
        "active"
      );

    });


  const activeCard =
    document.querySelector(
      `[data-prayer="${nextPrayer.id}"]`
    );


  if (activeCard) {

    activeCard.classList.add(
      "active"
    );

  }

}


/* ==========================================
   UPDATE PRAYER TIMES DISPLAY
========================================== */

function updatePrayerDisplay() {

  document
    .getElementById("fajr")
    .textContent =
      prayerTimes.fajr;


  document
    .getElementById("sunrise")
    .textContent =
      prayerTimes.sunrise;


  document
    .getElementById("dhuhr")
    .textContent =
      prayerTimes.dhuhr;


  document
    .getElementById("asr")
    .textContent =
      prayerTimes.asr;


  document
    .getElementById("maghrib")
    .textContent =
      prayerTimes.maghrib;


  document
    .getElementById("isha")
    .textContent =
      prayerTimes.isha;

}


/* ==========================================
   INITIALIZE
========================================== */

updatePrayerDisplay();

updateClock();


/* UPDATE SETIAP DETIK */

setInterval(
  updateClock,
  1000
);
