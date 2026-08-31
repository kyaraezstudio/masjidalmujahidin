/* ==========================================
   MASJID AL-MUJAHIDIN KR JATI
   DISPLAY JADWAL SALAT OTOMATIS
========================================== */


/* ==========================================
   KONFIGURASI LOKASI

   Sementara menggunakan titik Jakarta Timur.
   
   Nanti lebih akurat jika diganti dengan
   koordinat persis Masjid Al-Mujahidin.
========================================== */

const mosqueLocation = {
  latitude: -6.225,
  longitude: 106.900,
  timezone: "Asia/Jakarta"
};


/* ==========================================
   FALLBACK JADWAL

   Digunakan jika API sedang gagal.
========================================== */

let prayerTimes = {
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

let prayers = [];


/* ==========================================
   BUAT PRAYER LIST
========================================== */

function createPrayerList() {

  prayers = [
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

}


/* ==========================================
   FORMAT JAM

   API kadang mengembalikan:
   04:38 (WIB)

   Fungsi ini mengambil HH:MM saja.
========================================== */

function cleanTime(time) {

  return time
    .replace(/\s*\(.+\)/, "")
    .trim();

}


/* ==========================================
   AMBIL TANGGAL WIB

   Format:
   DD-MM-YYYY
========================================== */

function getJakartaDateForAPI() {

  const now = new Date();

  const parts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: mosqueLocation.timezone,

        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    ).formatToParts(now);


  const day =
    parts.find(
      part => part.type === "day"
    ).value;


  const month =
    parts.find(
      part => part.type === "month"
    ).value;


  const year =
    parts.find(
      part => part.type === "year"
    ).value;


  return `${day}-${month}-${year}`;

}


/* ==========================================
   FETCH JADWAL SALAT API
========================================== */

async function fetchPrayerTimes() {

  try {

    const date =
      getJakartaDateForAPI();


    const url =
      `https://api.aladhan.com/v1/timings/${date}` +
      `?latitude=${mosqueLocation.latitude}` +
      `&longitude=${mosqueLocation.longitude}` +
      `&method=20` +
      `&timezonestring=${mosqueLocation.timezone}`;


    const response =
      await fetch(url);


    if (!response.ok) {
      throw new Error(
        "Gagal mengambil jadwal salat"
      );
    }


    const result =
      await response.json();


    const timings =
      result.data.timings;


    /* UPDATE JADWAL */

    prayerTimes = {

      fajr:
        cleanTime(
          timings.Fajr
        ),

      sunrise:
        cleanTime(
          timings.Sunrise
        ),

      dhuhr:
        cleanTime(
          timings.Dhuhr
        ),

      asr:
        cleanTime(
          timings.Asr
        ),

      maghrib:
        cleanTime(
          timings.Maghrib
        ),

      isha:
        cleanTime(
          timings.Isha
        )

    };


    /* UPDATE DISPLAY */

    createPrayerList();

    updatePrayerDisplay();

    updateNextPrayer();


    console.log(
      "Jadwal salat berhasil diperbarui:",
      prayerTimes
    );


  } catch (error) {

    console.error(
      "Gagal mengambil API:",
      error
    );


    /* TETAP GUNAKAN
       JADWAL FALLBACK */

    createPrayerList();

    updatePrayerDisplay();

    updateNextPrayer();

  }

}


/* ==========================================
   UPDATE JADWAL DI DISPLAY
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
   GET WAKTU JAKARTA
========================================== */

function getJakartaTime() {

  const now = new Date();


  const time =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: mosqueLocation.timezone,

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: false
      }
    ).format(now);


  const parts =
    time.split(":");


  return {

    hour:
      Number(parts[0]),

    minute:
      Number(parts[1]),

    second:
      Number(parts[2])

  };

}


/* ==========================================
   UPDATE JAM REALTIME
========================================== */

function updateClock() {

  const now =
    new Date();


  /* JAM */

  const clock =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        timeZone: mosqueLocation.timezone,

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: false
      }
    ).format(now);


  document
    .getElementById("clock")
    .textContent =
      clock;


  /* HARI */

  const day =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        timeZone: mosqueLocation.timezone,

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
        timeZone: mosqueLocation.timezone,

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
        timeZone: mosqueLocation.timezone,

        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(now);


  document
    .getElementById("hijri-date")
    .textContent =
      hijriDate.toUpperCase();


  /* UPDATE COUNTDOWN */

  updateNextPrayer();

}


/* ==========================================
   CONVERT JAM KE DETIK
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
   CARI SALAT BERIKUTNYA
========================================== */

function updateNextPrayer() {

  if (!prayers.length) {
    return;
  }


  const current =
    getJakartaTime();


  const currentSeconds =
    current.hour * 3600 +
    current.minute * 60 +
    current.second;


  let nextPrayer = null;


  /* CARI SALAT HARI INI */

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


  /* JIKA SEMUA SALAT
     SUDAH LEWAT */

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
        fajrSeconds + 86400

    };

  }


  /* UPDATE NAMA */

  document
    .getElementById(
      "next-prayer-name"
    )
    .textContent =
      nextPrayer.name;


  /* UPDATE JAM */

  document
    .getElementById(
      "next-prayer-time"
    )
    .textContent =
      nextPrayer.time;


  /* HITUNG COUNTDOWN */

  let difference =
    nextPrayer.seconds -
    currentSeconds;


  if (difference < 0) {

    difference += 86400;

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


  const countdown =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;


  document
    .getElementById(
      "countdown"
    )
    .textContent =
      countdown;


  /* HIGHLIGHT CARD */

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
   CEK PERGANTIAN HARI

   Jika tanggal berubah,
   ambil jadwal baru otomatis.
========================================== */

let lastDate =
  getJakartaDateForAPI();


function checkNewDay() {

  const currentDate =
    getJakartaDateForAPI();


  if (
    currentDate !== lastDate
  ) {

    lastDate =
      currentDate;


    fetchPrayerTimes();

  }

}


/* ==========================================
   INITIALIZE
========================================== */

async function initializeApp() {

  /* BUAT DATA AWAL */

  createPrayerList();


  /* TAMPILKAN FALLBACK */

  updatePrayerDisplay();


  /* AMBIL JADWAL API */

  await fetchPrayerTimes();


  /* UPDATE JAM */

  updateClock();


/* UPDATE SETIAP DETIK */
setInterval(() => {

  updateClock();

  checkPrayerTime();

  updateAzanMode();

  updateIqamahMode();

}, 1000);

  /* CEK TANGGAL BARU */

  setInterval(
    checkNewDay,
    60000
  );

}


/* ==========================================
   TAMBAHAN MODE ADZAN & IQAMAH
========================================== */

let displayMode = "normal";

let activePrayer = null;

let modeStartTime = null;

let lastTriggeredPrayer = null;

/* DURASI */

const AZAN_DURATION = 180;


/* DURASI IQAMAH */

const IQAMAH_DURATION = {

  fajr: 10,

  dhuhr: 10,

  asr: 10,

  maghrib: 5,

  isha: 10

};


/* ==========================================
   START MODE ADZAN
========================================== */

function startAzanMode(prayer) {

  if (displayMode !== "normal") {
    return;
  }

  displayMode = "azan";

  activePrayer = prayer;

  modeStartTime = Date.now();


  document
    .getElementById("azan-screen")
    .classList.add("show");


  document
    .getElementById("azan-prayer-name")
    .textContent = prayer.name;


  document
    .getElementById("azan-time")
    .textContent = prayer.time;


  console.log(
    "Mode Adzan:",
    prayer.name
  );

}


/* ==========================================
   START MODE IQAMAH
========================================== */

function startIqamahMode() {

  displayMode = "iqamah";

  modeStartTime = Date.now();


  document
    .getElementById("azan-screen")
    .classList.remove("show");


  document
    .getElementById("iqamah-screen")
    .classList.add("show");


  document
    .getElementById("iqamah-prayer")
    .textContent = activePrayer.name;

}


/* ==========================================
   UPDATE MODE ADZAN
========================================== */

function updateAzanMode() {

  if (displayMode !== "azan") {
    return;
  }


  const elapsed = Math.floor(
    (Date.now() - modeStartTime) / 1000
  );


  if (elapsed >= AZAN_DURATION) {

    startIqamahMode();

  }

}


/* ==========================================
   UPDATE MODE IQAMAH
========================================== */

function updateIqamahMode() {

  if (displayMode !== "iqamah") {
    return;
  }


  const iqamahMinutes =
    IQAMAH_DURATION[activePrayer.id] || 10;


  const totalSeconds =
    iqamahMinutes * 60;


  const elapsed = Math.floor(
    (Date.now() - modeStartTime) / 1000
  );


  const remaining =
    Math.max(
      totalSeconds - elapsed,
      0
    );


  const minutes =
    Math.floor(
      remaining / 60
    );


  const seconds =
    remaining % 60;


  document
    .getElementById("iqamah-countdown")
    .textContent =
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`;


  if (remaining <= 0) {

    endIqamahMode();

  }

}



/* ==========================================
   END IQAMAH
========================================== */

function endIqamahMode() {

  document
    .getElementById("iqamah-screen")
    .classList.remove("show");

  displayMode = "normal";

  activePrayer = null;

  modeStartTime = null;

}


function checkPrayerTime() {

  if (displayMode !== "normal") {
    return;
  }

  const current =
    getJakartaTime();


  const currentSeconds =
    current.hour * 3600 +
    current.minute * 60 +
    current.second;


  const today =
    getJakartaDateForAPI();


  for (const prayer of prayers) {

    const prayerSeconds =
      timeToSeconds(
        prayer.time
      );


    if (
      currentSeconds >= prayerSeconds &&
      currentSeconds < prayerSeconds + 60
    ) {

      const triggerId =
        `${today}-${prayer.id}`;


      if (
        lastTriggeredPrayer === triggerId
      ) {
        return;
      }


      lastTriggeredPrayer =
        triggerId;


      startAzanMode(prayer);

      break;

    }

  }

}

initializeApp();
