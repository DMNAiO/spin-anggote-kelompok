/* =========================================================
   KONFIGURASI RAHASIA
=========================================================

   ATURAN INI TIDAK DITAMPILKAN DI WEBSITE.

   Kelompok:
   4 = Nida, Citra, Aurelia, Andy, Nandito
   6 = Chelsea, Zahirah, Riffali
   8 = Haris, Algasela

   Anggota lain tetap diacak.
========================================================= */


const HIDDEN_GROUPS = {

    4: [
        "Nida Faizah",
        "Citra Rahmatina",
        "Aurelia Gavrilia Oktavian",
        "Andy Heru Nugraha",
        "Nandito Eko Prabowo"
    ],

    6: [
        "Chelsea Aulia Rachma",
        "Zahirah Tsania Rai Azzahra",
        "Riffali Naufal Zaki"
    ],

    8: [
        "Haris Indra Permana",
        "Algasela Salsabila Kewinvada"
    ]

};


/* =========================================================
   ELEMENT
========================================================= */


const memberInput =
    document.getElementById("memberInput");


const memberCount =
    document.getElementById("memberCount");


const amountInput =
    document.getElementById("amountInput");


const amountLabel =
    document.getElementById("amountLabel");


const leaderToggle =
    document.getElementById("leaderToggle");


const leaderCount =
    document.getElementById("leaderCount");


const leaderCountWrapper =
    document.getElementById("leaderCountWrapper");


const spinButton =
    document.getElementById("spinButton");


const resetButton =
    document.getElementById("resetButton");


const groupsContainer =
    document.getElementById("groupsContainer");


const emptyResult =
    document.getElementById("emptyResult");


const resultStatus =
    document.getElementById("resultStatus");


const statusBadge =
    document.getElementById("statusBadge");


const spinOverlay =
    document.getElementById("spinOverlay");


const spinStage =
    document.getElementById("spinStage");


const rollingNames =
    document.getElementById("rollingNames");


const spinSubtext =
    document.getElementById("spinSubtext");


const loadingProgress =
    document.getElementById("loadingProgress");


const exportActions =
    document.getElementById("exportActions");


const copyButton =
    document.getElementById("copyButton");


const exportButton =
    document.getElementById("exportButton");


/* =========================================================
   SOUND ENGINE
   Tidak membutuhkan file MP3/WAV.
   Jadi tetap bisa digunakan secara offline.
========================================================= */


let audioContext = null;


function initAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {

            return null;

        }

        audioContext =
            new AudioContext();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    return audioContext;

}


/* Suara satu beep */

function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.045,
    delay = 0
) {

    const ctx =
        initAudio();


    if (!ctx) {

        return;

    }


    const oscillator =
        ctx.createOscillator();


    const gain =
        ctx.createGain();


    oscillator.type =
        type;


    oscillator.frequency.setValueAtTime(
        frequency,
        ctx.currentTime + delay
    );


    gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime + delay
    );


    gain.gain.exponentialRampToValueAtTime(
        volume,
        ctx.currentTime + delay + 0.01
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime +
            delay +
            duration
    );


    oscillator.connect(gain);

    gain.connect(ctx.destination);


    oscillator.start(
        ctx.currentTime + delay
    );


    oscillator.stop(
        ctx.currentTime +
            delay +
            duration +
            0.02
    );

}


/* Suara ketika nama sedang berputar */

function playRollSound() {

    playTone(
        260 + Math.random() * 180,
        0.055,
        "square",
        0.025
    );

}


/* Suara ketika tim ditentukan */

function playTeamSound() {

    playTone(
        520,
        0.09,
        "sine",
        0.05
    );

    playTone(
        680,
        0.12,
        "sine",
        0.05,
        0.08
    );

}


/* Suara selesai */

function playCompleteSound() {

    playTone(
        523.25,
        0.14,
        "sine",
        0.06
    );

    playTone(
        659.25,
        0.14,
        "sine",
        0.06,
        0.12
    );

    playTone(
        783.99,
        0.22,
        "sine",
        0.07,
        0.24
    );

}


/* Suara klik */

function playClickSound() {

    playTone(
        500,
        0.06,
        "sine",
        0.03
    );

}


/* =========================================================
   UTILITAS
========================================================= */


function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


/* Fisher-Yates */

function shuffle(array) {

    const result =
        [...array];


    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }


    return result;

}


/* =========================================================
   NAMA
========================================================= */


function getNames() {

    return memberInput.value

        .split("\n")

        .map(
            name =>
                name.trim()
        )

        .filter(
            name =>
                name.length > 0
        )

        .filter(
            (name, index, array) =>
                array.indexOf(name) === index
        );

}


function updateMemberCount() {

    const names =
        getNames();


    memberCount.textContent =
        `${names.length} anggota`;

}


memberInput.addEventListener(
    "input",
    updateMemberCount
);


/* =========================================================
   MODE PEMBAGIAN
========================================================= */


document
    .querySelectorAll(
        'input[name="distributionMode"]'
    )
    .forEach(
        radio => {

            radio.addEventListener(
                "change",
                updateDistributionLabel
            );

        }
    );


function updateDistributionLabel() {

    const mode =
        document.querySelector(
            'input[name="distributionMode"]:checked'
        ).value;


    if (mode === "groups") {

        amountLabel.textContent =
            "Jumlah tim";

    } else {

        amountLabel.textContent =
            "Anggota per tim";

    }

}


/* =========================================================
   TOGGLE PERWAKILAN
========================================================= */


leaderToggle.addEventListener(
    "change",
    () => {

        leaderCountWrapper.style.display =
            leaderToggle.checked
                ? "block"
                : "none";

    }
);


/* =========================================================
   JUMLAH TIM
========================================================= */


function calculateGroupCount(
    totalMembers
) {

    const mode =
        document.querySelector(
            'input[name="distributionMode"]:checked'
        ).value;


    const amount =
        parseInt(
            amountInput.value,
            10
        );


    if (
        !Number.isFinite(amount) ||
        amount < 1
    ) {

        return 0;

    }


    if (mode === "groups") {

        return Math.min(
            amount,
            totalMembers
        );

    }


    return Math.ceil(
        totalMembers / amount
    );

}


/* =========================================================
   HIDDEN MEMBERS
========================================================= */


function getHiddenMembers() {

    const result =
        new Set();


    Object.values(
        HIDDEN_GROUPS
    )
        .forEach(
            group => {

                group.forEach(
                    name => {

                        result.add(
                            name
                        );

                    }
                );

            }
        );


    return result;

}


/* =========================================================
   CREATE GROUP
========================================================= */


function createGroups(names) {

    const groupCount =
        calculateGroupCount(
            names.length
        );


    if (groupCount < 1) {

        return [];

    }


    const groups =
        Array.from(
            {
                length:
                    groupCount
            },
            (_, index) => ({

                number:
                    index + 1,

                members:
                    []

            })
        );


    /*
       Hitung target anggota.
    */

    const baseSize =
        Math.floor(
            names.length /
            groupCount
        );


    let extra =
        names.length %
        groupCount;


    const targetSizes =
        groups.map(
            () => {

                if (extra > 0) {

                    extra--;

                    return baseSize + 1;

                }

                return baseSize;

            }
        );


    const nameSet =
        new Set(names);


    const assignedHidden =
        new Set();


    /*
       Masukkan kelompok rahasia.
    */

    Object.entries(
        HIDDEN_GROUPS
    )
        .forEach(
            ([groupNumber, hiddenNames]) => {

                const number =
                    Number(groupNumber);


                if (
                    number < 1 ||
                    number > groupCount
                ) {

                    return;

                }


                const targetGroup =
                    groups[
                        number - 1
                    ];


                hiddenNames
                    .filter(
                        name =>
                            nameSet.has(name)
                    )
                    .forEach(
                        name => {

                            if (
                                !assignedHidden.has(
                                    name
                                )
                            ) {

                                targetGroup.members
                                    .push(name);


                                assignedHidden.add(
                                    name
                                );

                            }

                        }
                    );

            }
        );


    /*
       Sisa anggota.
    */

    let remaining =
        names.filter(
            name =>
                !assignedHidden.has(
                    name
                )
        );


    /*
       Acak sisa anggota.
    */

    remaining =
        shuffle(
            remaining
        );


    /*
       Distribusi seimbang.
    */

    for (
        const name of remaining
    ) {

        const availableGroups =
            groups.filter(
                (group, index) =>
                    group.members.length <
                    targetSizes[index]
            );


        if (
            availableGroups.length === 0
        ) {

            const smallest =
                [...groups]
                    .sort(
                        (a, b) =>
                            a.members.length -
                            b.members.length
                    )[0];


            smallest.members.push(
                name
            );


            continue;

        }


        const minimum =
            Math.min(
                ...availableGroups.map(
                    group =>
                        group.members.length
                )
            );


        const candidates =
            availableGroups.filter(
                group =>
                    group.members.length ===
                    minimum
            );


        const selected =
            candidates[
                Math.floor(
                    Math.random() *
                    candidates.length
                )
            ];


        selected.members.push(
            name
        );

    }


    /*
       Acak urutan nama di dalam kelompok.
    */

    groups.forEach(
        group => {

            group.members =
                shuffle(
                    group.members
                );

        }
    );


    return groups;

}


/* =========================================================
   ROLLING NAME
========================================================= */


function showRollingName(name) {

    rollingNames.innerHTML =
        "";


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "rolling-name";


    element.textContent =
        name;


    rollingNames.appendChild(
        element
    );

}


/* =========================================================
   RANDOM NAME ANIMATION
========================================================= */


async function randomNameAnimation(
    names,
    duration = 2000
) {

    const start =
        Date.now();


    while (
        Date.now() - start <
        duration
    ) {

        const randomName =
            names[
                Math.floor(
                    Math.random() *
                    names.length
                )
            ];


        showRollingName(
            randomName
        );


        /*
           Sound setiap beberapa pergantian
           supaya tidak terlalu berisik.
        */

        if (
            Math.random() > 0.45
        ) {

            playRollSound();

        }


        const elapsed =
            Date.now() -
            start;


        const progress =
            elapsed /
            duration;


        const delay =
            45 +
            progress * 80;


        await sleep(
            delay
        );

    }

}


/* =========================================================
   PILIH PERWAKILAN
========================================================= */


function chooseLeaders(groups) {

    const result =
        {};


    if (
        !leaderToggle.checked
    ) {

        return result;

    }


    let count =
        parseInt(
            leaderCount.value,
            10
        );


    if (
        !Number.isFinite(count) ||
        count < 1
    ) {

        count = 1;

    }


    groups.forEach(
        group => {

            const leaderAmount =
                Math.min(
                    count,
                    group.members.length
                );


            result[
                group.number
            ] =
                shuffle(
                    group.members
                ).slice(
                    0,
                    leaderAmount
                );

        }
    );


    return result;

}


/* =========================================================
   BUAT CARD KELOMPOK
========================================================= */


function createGroupCard(
    group,
    index,
    selectedLeaders
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "group-card";


    card.style.animationDelay =
        `${index * 0.05}s`;


    const header =
        document.createElement(
            "div"
        );


    header.className =
        "group-header";


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "group-title";


    const number =
        document.createElement(
            "div"
        );


    number.className =
        "group-number";


    number.textContent =
        group.number;


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "group-name";


    name.textContent =
        `Tim ${group.number}`;


    title.appendChild(
        number
    );


    title.appendChild(
        name
    );


    const total =
        document.createElement(
            "div"
        );


    total.className =
        "member-total";


    total.textContent =
        `${group.members.length} anggota`;


    header.appendChild(
        title
    );


    header.appendChild(
        total
    );


    const membersContainer =
        document.createElement(
            "div"
        );


    membersContainer.className =
        "group-members";


    group.members.forEach(
        (member, memberIndex) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "member-item";


            const memberName =
                document.createElement(
                    "div"
                );


            memberName.className =
                "member-name";


            const indexCircle =
                document.createElement(
                    "div"
                );


            indexCircle.className =
                "member-index";


            indexCircle.textContent =
                memberIndex + 1;


            const text =
                document.createElement(
                    "div"
                );


            text.className =
                "member-name-text";


            text.textContent =
                member;


            memberName.appendChild(
                indexCircle
            );


            memberName.appendChild(
                text
            );


            item.appendChild(
                memberName
            );


            /*
               Tandai perwakilan.
            */

            if (
                selectedLeaders &&
                selectedLeaders[
                    group.number
                ] &&
                selectedLeaders[
                    group.number
                ].includes(
                    member
                )
            ) {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.className =
                    "leader-tag";


                tag.textContent =
                    "Perwakilan";


                item.appendChild(
                    tag
                );

            }


            membersContainer.appendChild(
                item
            );

        }
    );


    card.appendChild(
        header
    );


    card.appendChild(
        membersContainer
    );


    return card;

}


/* =========================================================
   REVEAL KELOMPOK
========================================================= */


async function revealGroups(
    groups,
    selectedLeaders
) {

    groupsContainer.innerHTML =
        "";


    emptyResult.style.display =
        "none";


    groupsContainer.style.display =
        "grid";


    for (
        let i = 0;
        i < groups.length;
        i++
    ) {

        const group =
            groups[i];


        /*
           Update tulisan.
        */

        spinStage.textContent =
            `MENENTUKAN TIM ${group.number}...`;


        spinSubtext.textContent =
            `Mengacak anggota Tim ${group.number}`;


        /*
           Sound transisi.
        */

        playTeamSound();


        /*
           Nama terus berputar.
        */

        await randomNameAnimation(
            group.members,
            900
        );


        /*
           Tampilkan nama tim.
        */

        showRollingName(
            `Tim ${group.number}`
        );


        await sleep(
            350
        );


        /*
           Tampilkan card.
        */

        const card =
            createGroupCard(
                group,
                i,
                selectedLeaders
            );


        groupsContainer.appendChild(
            card
        );


        /*
           Progress.
        */

        const progress =
            25 +
            (
                (i + 1) /
                groups.length
            ) *
            70;


        loadingProgress.style.width =
            `${progress}%`;


        await sleep(
            350
        );

    }

}


/* =========================================================
   ANIMASI UTAMA
========================================================= */


async function playSpinAnimation(
    names,
    groups,
    selectedLeaders
) {

    spinOverlay.classList.add(
        "active"
    );


    spinStage.textContent =
        "MENGACAK SEMUA ANGGOTA...";


    spinSubtext.textContent =
        "Semua anggota sedang diacak";


    loadingProgress.style.width =
        "0%";


    /*
       Suara awal.
    */

    playClickSound();


    await sleep(
        150
    );


    /*
       FASE 1
    */

    await randomNameAnimation(
        names,
        2200
    );


    loadingProgress.style.width =
        "25%";


    await sleep(
        300
    );


    /*
       FASE 2
    */

    await revealGroups(
        groups,
        selectedLeaders
    );


    loadingProgress.style.width =
        "100%";


    /*
       SELESAI
    */

    spinStage.textContent =
        "✓ PEMBAGIAN SELESAI!";


    spinSubtext.textContent =
        "Semua anggota telah mendapatkan kelompok";


    showRollingName(
        "Selesai!"
    );


    /*
       Sound kemenangan.
    */

    playCompleteSound();


    await sleep(
        1100
    );


    spinOverlay.classList.remove(
        "active"
    );

}


/* =========================================================
   FORMAT HASIL
========================================================= */


function generateResultText() {

    const cards =
        groupsContainer.querySelectorAll(
            ".group-card"
        );


    if (
        cards.length === 0
    ) {

        return "";

    }


    let text =
        "HASIL PEMBAGIAN KELOMPOK\n";


    text +=
        "================================\n\n";


    cards.forEach(
        card => {

            const groupName =
                card.querySelector(
                    ".group-name"
                ).textContent;


            const members =
                card.querySelectorAll(
                    ".member-item"
                );


            text +=
                `${groupName}\n`;


            text +=
                "----------------------------\n";


            members.forEach(
                (member, index) => {

                    const name =
                        member.querySelector(
                            ".member-name-text"
                        ).textContent;


                    const leader =
                        member.querySelector(
                            ".leader-tag"
                        );


                    text +=
                        `${index + 1}. ${name}`;


                    if (leader) {

                        text +=
                            " [Perwakilan]";

                    }


                    text +=
                        "\n";

                }
            );


            text +=
                "\n";

        }
    );


    return text;

}


/* =========================================================
   SALIN HASIL
========================================================= */


copyButton.addEventListener(
    "click",
    async () => {

        const text =
            generateResultText();


        if (!text) {

            return;

        }


        playClickSound();


        try {

            await navigator.clipboard.writeText(
                text
            );


        } catch (error) {

            /*
               Fallback browser lama.
            */

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                text;


            document.body.appendChild(
                textarea
            );


            textarea.select();


            document.execCommand(
                "copy"
            );


            textarea.remove();

        }


        const oldText =
            copyButton.textContent;


        copyButton.textContent =
            "✓ Berhasil Disalin";


        setTimeout(
            () => {

                copyButton.textContent =
                    oldText;

            },
            1500
        );

    }
);


/* =========================================================
   DOWNLOAD HASIL
========================================================= */


exportButton.addEventListener(
    "click",
    () => {

        const text =
            generateResultText();


        if (!text) {

            return;

        }


        playClickSound();


        const blob =
            new Blob(
                [text],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        const date =
            new Date();


        const filename =
            `Hasil_Pembagian_Kelompok_${date
                .getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    date.getDate()
                ).padStart(2, "0")}.txt`;


        link.download =
            filename;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }
);


/* =========================================================
   JALANKAN
========================================================= */


spinButton.addEventListener(
    "click",
    async () => {

        const names =
            getNames();


        /*
           Inisialisasi audio SEBELUM
           proses async agar browser mengizinkan suara.
        */

        initAudio();


        if (
            names.length < 2
        ) {

            alert(
                "Masukkan minimal 2 anggota."
            );

            return;

        }


        const groupCount =
            calculateGroupCount(
                names.length
            );


        if (
            groupCount < 1
        ) {

            alert(
                "Jumlah tim tidak valid."
            );

            return;

        }


        /*
           Buat kelompok.
        */

        const groups =
            createGroups(
                names
            );


        if (
            !groups ||
            groups.length === 0
        ) {

            alert(
                "Gagal membuat kelompok."
            );

            return;

        }


        /*
           Pilih perwakilan.
        */

        const selectedLeaders =
            chooseLeaders(
                groups
            );


        /*
           Matikan kontrol.
        */

        spinButton.disabled =
            true;


        resetButton.disabled =
            true;


        amountInput.disabled =
            true;


        memberInput.disabled =
            true;


        document
            .querySelectorAll(
                'input[name="distributionMode"]'
            )
            .forEach(
                radio =>
                    radio.disabled =
                        true
            );


        leaderToggle.disabled =
            true;


        leaderCount.disabled =
            true;


        /*
           Status.
        */

        statusBadge.textContent =
            "Mengacak...";


        statusBadge.style.background =
            "#eef2ff";


        statusBadge.style.color =
            "#4f46e5";


        resultStatus.textContent =
            "Pembagian sedang diproses";


        groupsContainer.innerHTML =
            "";


        exportActions.style.display =
            "none";


        /*
           Jalankan.
        */

        await playSpinAnimation(
            names,
            groups,
            selectedLeaders
        );


        /*
           Tombol export muncul.
        */

        exportActions.style.display =
            "grid";


        /*
           Status selesai.
        */

        statusBadge.textContent =
            "Selesai";


        statusBadge.style.background =
            "#dcfce7";


        statusBadge.style.color =
            "#166534";


        resultStatus.textContent =
            `${groups.length} tim berhasil dibuat`;


        /*
           Aktifkan kembali kontrol.
        */

        spinButton.disabled =
            false;


        resetButton.disabled =
            false;


        amountInput.disabled =
            false;


        memberInput.disabled =
            false;


        document
            .querySelectorAll(
                'input[name="distributionMode"]'
            )
            .forEach(
                radio =>
                    radio.disabled =
                        false
            );


        leaderToggle.disabled =
            false;


        leaderCount.disabled =
            false;

    }
);


/* =========================================================
   RESET
========================================================= */


resetButton.addEventListener(
    "click",
    () => {

        playClickSound();


        memberInput.value =
            "";


        groupsContainer.innerHTML =
            "";


        groupsContainer.style.display =
            "none";


        exportActions.style.display =
            "none";


        emptyResult.style.display =
            "flex";


        memberCount.textContent =
            "0 anggota";


        resultStatus.textContent =
            "Belum ada pembagian";


        statusBadge.textContent =
            "Menunggu";


        statusBadge.style.background =
            "#f3f4f6";


        statusBadge.style.color =
            "#6b7280";


        amountInput.value =
            "10";


        leaderCount.value =
            "1";


        loadingProgress.style.width =
            "0%";


        spinStage.textContent =
            "MENGACAK SEMUA ANGGOTA...";


        spinSubtext.textContent =
            "Harap tunggu...";


        rollingNames.textContent =
            "Nama";

    }
);


/* =========================================================
   INITIAL
========================================================= */


groupsContainer.style.display =
    "none";


leaderCountWrapper.style.display =
    leaderToggle.checked
        ? "block"
        : "none";


updateMemberCount();

updateDistributionLabel();
/* =========================================================
   AUTHENTICATION & LIVE CHAT
   Supabase menyediakan login Google dan sinkronisasi realtime.
========================================================= */

const googleLoginButton =
    document.getElementById("googleLoginButton");


const logoutButton =
    document.getElementById("logoutButton");


const authLoggedOut =
    document.getElementById("authLoggedOut");


const authLoggedIn =
    document.getElementById("authLoggedIn");


const authAvatar =
    document.getElementById("authAvatar");


const authName =
    document.getElementById("authName");


const authEmail =
    document.getElementById("authEmail");


const authStatus =
    document.getElementById("authStatus");


const chatSignedOut =
    document.getElementById("chatSignedOut");


const chatWorkspace =
    document.getElementById("chatWorkspace");


const chatConnectionStatus =
    document.getElementById("chatConnectionStatus");


const chatUsers =
    document.getElementById("chatUsers");


const chatUserCount =
    document.getElementById("chatUserCount");


const chatConversationHeader =
    document.getElementById("chatConversationHeader");


const chatMessages =
    document.getElementById("chatMessages");


const chatForm =
    document.getElementById("chatForm");


const chatInput =
    document.getElementById("chatInput");


const chatSendButton =
    document.getElementById("chatSendButton");


let supabaseClient = null;
let currentUser = null;
let selectedChatUser = null;
let selectedConversationId = null;
let usersChannel = null;
let messagesChannel = null;
let userRefreshTimer = null;


function setAuthStatus(message, isError = false) {

    authStatus.textContent =
        message;

    authStatus.style.color =
        isError
            ? "#b91c1c"
            : "";

}


function setChatConnectionStatus(message, state = "") {

    chatConnectionStatus.textContent =
        message;

    chatConnectionStatus.className =
        `chat-connection-status ${state}`;

}


function isSupabaseConfigured() {

    const config =
        window.SUPABASE_CONFIG;

    return Boolean(
        config
        && typeof config.url === "string"
        && config.url.startsWith("https://")
        && !config.url.includes("ISI_PROJECT_REF")
        && typeof config.anonKey === "string"
        && config.anonKey.length > 20
        && !config.anonKey.includes("ISI_")
    );

}


function clearChatChannels() {

    if (usersChannel) {
        supabaseClient
            .removeChannel(
                usersChannel
            );

        usersChannel =
            null;
    }

    if (messagesChannel) {
        supabaseClient
            .removeChannel(
                messagesChannel
            );

        messagesChannel =
            null;
    }

    if (userRefreshTimer) {
        clearTimeout(
            userRefreshTimer
        );

        userRefreshTimer =
            null;
    }

}


function renderSignedOut() {

    authLoggedOut.style.display =
        "block";

    authLoggedIn.style.display =
        "none";

    chatSignedOut.style.display =
        "flex";

    chatWorkspace.style.display =
        "none";

    chatUsers.innerHTML =
        "";

    chatMessages.innerHTML =
        "";

    chatInput.value =
        "";

    chatInput.disabled =
        true;

    chatSendButton.disabled =
        true;

    selectedChatUser =
        null;

    selectedConversationId =
        null;

    clearChatChannels();

    setChatConnectionStatus(
        "Login diperlukan"
    );

}


function renderSignedIn(user) {

    authLoggedOut.style.display =
        "none";

    authLoggedIn.style.display =
        "flex";

    chatSignedOut.style.display =
        "none";

    chatWorkspace.style.display =
        "grid";

    authName.textContent =
        user.user_metadata?.full_name
        || user.email
        || "Pengguna";

    authEmail.textContent =
        user.email
        || "";

    authAvatar.src =
        user.user_metadata?.avatar_url
        || "";

    authAvatar.alt =
        `Foto ${authName.textContent}`;

    setAuthStatus(
        "Login dengan akun Google"
    );

    setChatConnectionStatus(
        "Terhubung",
        "connected"
    );

}


function getUserName(user) {

    return user.display_name
        || user.email
        || "Pengguna";

}


function getUserAvatar(user) {

    return user.avatar_url
        || "";

}


function getUserPair(firstUserId, secondUserId) {

    return [
        firstUserId,
        secondUserId
    ].sort();

}


function formatMessageTime(timestamp) {

    if (!timestamp) {
        return "Mengirim...";
    }

    return new Date(
        timestamp
    ).toLocaleTimeString(
        "id-ID",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function renderMessages(messages) {

    chatMessages.innerHTML =
        "";

    if (!messages || messages.length === 0) {

        const empty =
            document.createElement(
                "p"
            );

        empty.className =
            "chat-placeholder";

        empty.textContent =
            "Belum ada pesan. Sapa anggota ini!";

        chatMessages.appendChild(
            empty
        );

        return;

    }

    messages.forEach(
        message => {

            const messageElement =
                document.createElement(
                    "div"
                );

            messageElement.className =
                "chat-message";

            if (
                message.sender_id ===
                currentUser.id
            ) {
                messageElement.classList.add(
                    "mine"
                );
            }

            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                message.body;

            const time =
                document.createElement(
                    "small"
                );

            time.className =
                "chat-message-time";

            time.textContent =
                formatMessageTime(
                    message.created_at
                );

            messageElement.append(
                text,
                time
            );

            chatMessages.appendChild(
                messageElement
            );

        }
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


async function loadMessages() {

    if (
        !selectedConversationId
        || !supabaseClient
    ) {
        return;
    }

    const result =
        await supabaseClient
            .from("messages")
            .select("id, sender_id, receiver_id, body, created_at")
            .eq(
                "conversation_id",
                selectedConversationId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            )
            .limit(100);

    if (result.error) {
        console.error(
            "Gagal memuat pesan:",
            result.error
        );

        setChatConnectionStatus(
            "Chat tidak tersedia",
            "error"
        );

        return;
    }

    renderMessages(
        result.data
    );

}


function subscribeToMessages() {

    if (messagesChannel) {
        supabaseClient
            .removeChannel(
                messagesChannel
            );
    }

    messagesChannel =
        supabaseClient
            .channel(
                `messages-${selectedConversationId}`
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                    filter:
                        `conversation_id=eq.${selectedConversationId}`
                },
                loadMessages
            )
            .subscribe();

}


async function getOrCreateConversation(user) {

    const pair =
        getUserPair(
            currentUser.id,
            user.id
        );

    let result =
        await supabaseClient
            .from("conversations")
            .select("id")
            .eq("user_one", pair[0])
            .eq("user_two", pair[1])
            .maybeSingle();

    if (result.error) {
        throw result.error;
    }

    if (!result.data) {
        result =
            await supabaseClient
                .from("conversations")
                .insert(
                    {
                        user_one: pair[0],
                        user_two: pair[1]
                    }
                )
                .select("id")
                .single();

        if (
            result.error
            && result.error.code !== "23505"
        ) {
            throw result.error;
        }

        if (!result.data) {
            result =
                await supabaseClient
                    .from("conversations")
                    .select("id")
                    .eq("user_one", pair[0])
                    .eq("user_two", pair[1])
                    .single();
        }
    }

    if (
        result.error
        || !result.data
    ) {
        throw result.error
            || new Error(
                "Percakapan tidak ditemukan."
            );
    }

    return result.data.id;

}


async function selectChatUser(user) {

    selectedChatUser =
        user;

    chatConversationHeader.textContent =
        `Chat dengan ${getUserName(user)}`;

    chatInput.disabled =
        true;

    chatSendButton.disabled =
        true;

    chatMessages.innerHTML =
        "";

    try {
        selectedConversationId =
            await getOrCreateConversation(
                user
            );

        chatInput.disabled =
            false;

        chatSendButton.disabled =
            false;

        renderUsers(
            window.chatUsersCache || []
        );

        await loadMessages();
        subscribeToMessages();
        chatInput.focus();

    } catch (error) {
        console.error(
            "Gagal membuka percakapan:",
            error
        );

        setChatConnectionStatus(
            "Gagal membuka chat",
            "error"
        );
    }

}


function renderUsers(users = []) {

    window.chatUsersCache =
        users;

    chatUsers.innerHTML =
        "";

    chatUserCount.textContent =
        String(users.length);

    if (users.length === 0) {

        const empty =
            document.createElement(
                "p"
            );

        empty.className =
            "chat-placeholder";

        empty.textContent =
            "Belum ada anggota lain yang login.";

        chatUsers.appendChild(
            empty
        );

        return;

    }

    users.forEach(
        user => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "chat-user";

            if (
                selectedChatUser
                && selectedChatUser.id === user.id
            ) {
                button.classList.add(
                    "selected"
                );
            }

            const avatar =
                document.createElement(
                    "img"
                );

            avatar.className =
                "chat-user-avatar";

            avatar.src =
                getUserAvatar(user);

            avatar.alt =
                "";

            const copy =
                document.createElement(
                    "span"
                );

            copy.className =
                "chat-user-copy";

            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                getUserName(user);

            const email =
                document.createElement(
                    "small"
                );

            email.textContent =
                user.email
                || "";

            copy.append(
                name,
                email
            );

            button.append(
                avatar,
                copy
            );

            button.addEventListener(
                "click",
                () =>
                    selectChatUser(user)
            );

            chatUsers.appendChild(
                button
            );

        }
    );

}


async function loadUsers() {

    const result =
        await supabaseClient
            .from("profiles")
            .select("id, display_name, email, avatar_url")
            .neq(
                "id",
                currentUser.id
            )
            .order(
                "display_name",
                {
                    ascending: true
                }
            );

    if (result.error) {
        console.error(
            "Gagal memuat pengguna:",
            result.error
        );

        setChatConnectionStatus(
            "Database tidak tersedia",
            "error"
        );

        return;
    }

    renderUsers(
        result.data
    );

}


function subscribeToUsers() {

    usersChannel =
        supabaseClient
            .channel("profiles-list")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "profiles"
                },
                () => {
                    if (userRefreshTimer) {
                        clearTimeout(
                            userRefreshTimer
                        );
                    }

                    userRefreshTimer =
                        setTimeout(
                            loadUsers,
                            200
                        );
                }
            )
            .subscribe();

}


async function saveCurrentUser(user) {

    const metadata =
        user.user_metadata
        || {};

    const result =
        await supabaseClient
            .from("profiles")
            .upsert(
                {
                    id: user.id,
                    display_name:
                        metadata.full_name
                        || user.email
                        || "",
                    email:
                        user.email
                        || "",
                    avatar_url:
                        metadata.avatar_url
                        || ""
                }
            );

    if (result.error) {
        throw result.error;
    }

}


async function initializeChatUser(user) {

    currentUser =
        user;

    renderSignedIn(
        user
    );

    try {
        await saveCurrentUser(
            user
        );

        await loadUsers();
        subscribeToUsers();

    } catch (error) {
        console.error(
            "Gagal menyiapkan profil:",
            error
        );

        setChatConnectionStatus(
            "Database tidak tersedia",
            "error"
        );

        setAuthStatus(
            "Login berhasil, database belum siap",
            true
        );
    }

}


async function signInWithGoogle() {

    if (!supabaseClient) {
        return;
    }

    googleLoginButton.disabled =
        true;

    setAuthStatus(
        "Membuka login Google..."
    );

    const result =
        await supabaseClient.auth.signInWithOAuth(
            {
                provider: "google",
                options: {
                    redirectTo:
                        window.location.href
                }
            }
        );

    if (result.error) {
        console.error(
            "Login Google gagal:",
            result.error
        );

        googleLoginButton.disabled =
            false;

        setAuthStatus(
            "Login Google gagal. Coba lagi.",
            true
        );
    }

}


async function signOutUser() {

    if (!supabaseClient) {
        return;
    }

    const result =
        await supabaseClient.auth.signOut();

    if (result.error) {
        console.error(
            "Logout gagal:",
            result.error
        );

        setAuthStatus(
            "Logout gagal. Coba lagi.",
            true
        );
    }

}


async function initializeSupabaseChat() {

    renderSignedOut();

    if (
        !isSupabaseConfigured()
        || typeof supabase === "undefined"
    ) {

        googleLoginButton.disabled =
            true;

        setAuthStatus(
            "Isi konfigurasi Supabase terlebih dahulu.",
            true
        );

        setChatConnectionStatus(
            "Konfigurasi belum siap",
            "error"
        );

        return;

    }

    try {
        supabaseClient =
            supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey
            );

        supabaseClient.auth.onAuthStateChange(
            (event, session) => {

                setTimeout(
                    async () => {

                        clearChatChannels();

                        if (session) {
                            await initializeChatUser(
                                session.user
                            );
                        } else {
                            currentUser =
                                null;

                            renderSignedOut();

                            setAuthStatus(
                                "Belum login"
                            );
                        }

                    },
                    0
                );

            }
        );

    } catch (error) {
        console.error(
            "Inisialisasi Supabase gagal:",
            error
        );

        googleLoginButton.disabled =
            true;

        setAuthStatus(
            "Supabase gagal diinisialisasi.",
            true
        );

        setChatConnectionStatus(
            "Inisialisasi gagal",
            "error"
        );
    }

}


chatForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const text =
            chatInput.value.trim();

        if (
            !text
            || !currentUser
            || !selectedChatUser
            || !selectedConversationId
            || !supabaseClient
        ) {
            return;
        }

        chatInput.disabled =
            true;

        chatSendButton.disabled =
            true;

        const result =
            await supabaseClient
                .from("messages")
                .insert(
                    {
                        conversation_id:
                            selectedConversationId,
                        sender_id:
                            currentUser.id,
                        receiver_id:
                            selectedChatUser.id,
                        body: text
                    }
                );

        if (result.error) {
            console.error(
                "Pesan gagal dikirim:",
                result.error
            );

            setChatConnectionStatus(
                "Pesan gagal dikirim",
                "error"
            );
        } else {
            chatInput.value =
                "";
        }

        chatInput.disabled =
            false;

        chatSendButton.disabled =
            false;

        chatInput.focus();

    }
);


googleLoginButton.addEventListener(
    "click",
    signInWithGoogle
);


logoutButton.addEventListener(
    "click",
    signOutUser
);


initializeSupabaseChat();


