/* =========================================================
   PENGATURAN RAHASIA
   =========================================================

   Kelompok tertentu sudah ditentukan sebelumnya.

   Jangan ditampilkan di HTML.
   Jangan ditampilkan di halaman.
   Hanya digunakan oleh sistem ketika melakukan pengacakan.

   Nomor kelompok mengikuti nomor yang ditulis di sini.
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
   ELEMENT HTML
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


/* =========================================================
   UTILITAS
========================================================= */


function sleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/* Fisher-Yates Shuffle */

function shuffle(array) {

    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(Math.random() * (i + 1));

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


/* Ambil nama dari textarea */

function getNames() {

    return memberInput.value

        .split("\n")

        .map(name => name.trim())

        .filter(name => name.length > 0)

        .filter(
            (name, index, array) =>
                array.indexOf(name) === index
        );

}


/* =========================================================
   JUMLAH ANGGOTA
========================================================= */


function updateMemberCount() {

    const names = getNames();

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
    .forEach(radio => {

        radio.addEventListener(
            "change",
            updateDistributionLabel
        );

    });


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
   HITUNG JUMLAH TIM
========================================================= */


function calculateGroupCount(totalMembers) {

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
   CEK HIDDEN GROUP
========================================================= */


function getHiddenMembers() {

    const result = new Set();

    Object.values(HIDDEN_GROUPS)
        .forEach(group => {

            group.forEach(name => {

                result.add(name);

            });

        });

    return result;

}


/* =========================================================
   MEMBUAT KELOMPOK
========================================================= */


function createGroups(names) {

    const groupCount =
        calculateGroupCount(
            names.length
        );


    if (groupCount < 1) {

        return [];

    }


    /*
       Buat array kelompok.
       Contoh 10 kelompok:

       [
         { number: 1, members: [] },
         { number: 2, members: [] },
         ...
         { number: 10, members: [] }
       ]
    */

    const groups =
        Array.from(
            { length: groupCount },
            (_, index) => ({
                number: index + 1,
                members: []
            })
        );


    /*
       Tentukan ukuran target tiap kelompok.

       Contoh:
       37 orang / 10 kelompok

       Hasil:
       4,4,4,4,4,4,3,3,3,3
    */

    const baseSize =
        Math.floor(
            names.length / groupCount
        );


    let extra =
        names.length % groupCount;


    const targetSizes =
        groups.map(() => {

            if (extra > 0) {

                extra--;

                return baseSize + 1;

            }

            return baseSize;

        });


    /*
       Cari nama yang termasuk kelompok rahasia.
    */

    const hiddenMembers =
        getHiddenMembers();


    /*
       Validasi agar nama hidden memang ada
       di daftar anggota.
    */

    const nameSet =
        new Set(names);


    /*
       Anggota yang benar-benar tersedia
       untuk dimasukkan ke kelompok rahasia.
    */

    const assignedHidden =
        new Set();


    /*
       Masukkan kelompok rahasia ke nomor
       yang sudah ditentukan.
    */

    Object.entries(HIDDEN_GROUPS)
        .forEach(
            ([groupNumber, hiddenNames]) => {

                const number =
                    Number(groupNumber);


                /*
                   Kalau jumlah tim kurang dari
                   nomor kelompok rahasia,
                   kelompok tersebut tidak bisa
                   digunakan.
                */

                if (
                    number < 1 ||
                    number > groupCount
                ) {

                    return;

                }


                const targetGroup =
                    groups[number - 1];


                /*
                   Hanya ambil nama yang memang
                   ada di daftar input.
                */

                const availableNames =
                    hiddenNames.filter(
                        name =>
                            nameSet.has(name)
                    );


                /*
                   Tambahkan nama yang sudah
                   ditentukan.
                */

                availableNames.forEach(name => {

                    /*
                       Jangan masukkan nama dua kali.
                    */

                    if (
                        !assignedHidden.has(name)
                    ) {

                        targetGroup.members.push(name);

                        assignedHidden.add(name);

                    }

                });

            }
        );


    /*
       Ambil anggota yang belum ditentukan.
    */

    let remaining =
        names.filter(
            name =>
                !assignedHidden.has(name)
        );


    /*
       Acak anggota yang belum ditentukan.
    */

    remaining =
        shuffle(remaining);


    /*
       Masukkan anggota biasa ke kelompok
       yang masih punya slot.

       Kelompok rahasia tetap utuh.
    */

    for (const name of remaining) {

        /*
           Cari kelompok dengan jumlah anggota
           paling sedikit dan masih memiliki slot.
        */

        const availableGroups =
            groups.filter(
                (group, index) =>
                    group.members.length <
                    targetSizes[index]
            );


        if (availableGroups.length === 0) {

            /*
               Pengaman kalau ada kondisi
               pembagian yang tidak terduga.
            */

            const smallest =
                [...groups]
                    .sort(
                        (a, b) =>
                            a.members.length -
                            b.members.length
                    )[0];

            smallest.members.push(name);

            continue;

        }


        /*
           Cari ukuran terkecil.
        */

        const minimum =
            Math.min(
                ...availableGroups.map(
                    group =>
                        group.members.length
                )
            );


        /*
           Ambil semua kelompok yang memiliki
           ukuran minimum.
        */

        const candidates =
            availableGroups.filter(
                group =>
                    group.members.length ===
                    minimum
            );


        /*
           Kalau ada beberapa kandidat,
           pilih secara acak.
        */

        const selected =
            candidates[
                Math.floor(
                    Math.random() *
                    candidates.length
                )
            ];


        selected.members.push(name);

    }


    /*
       Acak urutan anggota biasa di setiap kelompok.

       Kelompok rahasia tetap satu kelompok,
       tetapi urutan nama di dalamnya boleh acak.
    */

    groups.forEach(group => {

        group.members =
            shuffle(group.members);

    });


    return groups;

}


/* =========================================================
   ANIMASI NAMA
========================================================= */


function showRollingName(name) {

    rollingNames.innerHTML = "";

    const element =
        document.createElement("div");

    element.className =
        "rolling-name";

    element.textContent =
        name;

    rollingNames.appendChild(element);

}


/* =========================================================
   ANIMASI ACAK NAMA
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


        const elapsed =
            Date.now() - start;


        /*
           Semakin mendekati akhir,
           animasi sedikit melambat.
        */

        const progress =
            elapsed / duration;


        const delay =
            45 + (progress * 80);


        await sleep(delay);

    }

}


/* =========================================================
   BUAT KARTU KELOMPOK
========================================================= */


function createGroupCard(
    group,
    index,
    selectedLeaders
) {

    const card =
        document.createElement("div");

    card.className =
        "group-card";


    /*
       Delay animasi berdasarkan urutan
       kelompok.
    */

    card.style.animationDelay =
        `${index * 0.05}s`;


    const header =
        document.createElement("div");

    header.className =
        "group-header";


    const title =
        document.createElement("div");

    title.className =
        "group-title";


    const number =
        document.createElement("div");

    number.className =
        "group-number";

    number.textContent =
        group.number;


    const name =
        document.createElement("div");

    name.className =
        "group-name";

    name.textContent =
        `Tim ${group.number}`;


    title.appendChild(number);

    title.appendChild(name);


    const total =
        document.createElement("div");

    total.className =
        "member-total";

    total.textContent =
        `${group.members.length} anggota`;


    header.appendChild(title);

    header.appendChild(total);


    const membersContainer =
        document.createElement("div");

    membersContainer.className =
        "group-members";


    group.members.forEach(
        (member, memberIndex) => {

            const item =
                document.createElement("div");

            item.className =
                "member-item";


            const memberName =
                document.createElement("div");

            memberName.className =
                "member-name";


            const indexCircle =
                document.createElement("div");

            indexCircle.className =
                "member-index";

            indexCircle.textContent =
                memberIndex + 1;


            const text =
                document.createElement("div");

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
               Cek apakah orang ini terpilih
               sebagai perwakilan.
            */

            if (
                selectedLeaders &&
                selectedLeaders[group.number] &&
                selectedLeaders[group.number]
                    .includes(member)
            ) {

                const tag =
                    document.createElement("span");

                tag.className =
                    "leader-tag";

                tag.textContent =
                    "Perwakilan";

                item.appendChild(tag);

            }


            membersContainer.appendChild(item);

        }
    );


    card.appendChild(header);

    card.appendChild(membersContainer);


    return card;

}


/* =========================================================
   PILIH PERWAKILAN
========================================================= */


function chooseLeaders(groups) {

    const result = {};


    if (!leaderToggle.checked) {

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


    groups.forEach(group => {

        /*
           Jumlah perwakilan tidak boleh
           melebihi jumlah anggota.
        */

        const leaderAmount =
            Math.min(
                count,
                group.members.length
            );


        /*
           Acak anggota kelompok khusus untuk
           memilih perwakilan.
        */

        result[group.number] =
            shuffle(
                group.members
            ).slice(
                0,
                leaderAmount
            );

    });


    return result;

}


/* =========================================================
   TAMPILKAN HASIL PERLAHAN
========================================================= */


async function revealGroups(
    groups,
    selectedLeaders
) {

    groupsContainer.innerHTML = "";

    emptyResult.style.display = "none";

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
           Update status animasi.
        */

        spinStage.textContent =
            `MENENTUKAN TIM ${group.number}...`;


        spinSubtext.textContent =
            `Mengacak anggota Tim ${group.number}`;


        /*
           Nama tetap bergerak beberapa saat.
        */

        await randomNameAnimation(
            group.members,
            900
        );


        /*
           Setelah selesai,
           tampilkan nama asli kelompok.
        */

        showRollingName(
            `Tim ${group.number}`
        );


        await sleep(350);


        /*
           Masukkan kartu ke halaman hasil.
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
           Scroll otomatis sedikit
           ketika banyak kelompok.
        */

        const resultCard =
            document.querySelector(
                ".result-card"
            );


        if (resultCard) {

            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }


        await sleep(350);

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

    spinOverlay.classList.add("active");


    spinStage.textContent =
        "MENGACAK SEMUA ANGGOTA...";


    spinSubtext.textContent =
        "Semua anggota sedang diacak";


    loadingProgress.style.width =
        "0%";


    /*
       FASE 1
       Acak semua nama.
    */

    await randomNameAnimation(
        names,
        2200
    );


    loadingProgress.style.width =
        "25%";


    await sleep(300);


    /*
       FASE 2
       Tentukan kelompok satu per satu.
    */

    await revealGroups(
        groups,
        selectedLeaders
    );


    loadingProgress.style.width =
        "100%";


    /*
       Selesai.
    */

    spinStage.textContent =
        "✓ PEMBAGIAN SELESAI!";


    spinSubtext.textContent =
        "Semua anggota telah mendapatkan kelompok";


    showRollingName(
        "Selesai!"
    );


    await sleep(1000);


    spinOverlay.classList.remove(
        "active"
    );

}


/* =========================================================
   JALANKAN
========================================================= */


spinButton.addEventListener(
    "click",
    async () => {

        const names =
            getNames();


        /*
           Validasi jumlah anggota.
        */

        if (names.length < 2) {

            alert(
                "Masukkan minimal 2 anggota."
            );

            return;

        }


        const groupCount =
            calculateGroupCount(
                names.length
            );


        if (groupCount < 1) {

            alert(
                "Jumlah tim tidak valid."
            );

            return;

        }


        /*
           Cek apakah kelompok rahasia
           membutuhkan nomor tim yang belum ada.
        */

        const hiddenGroupNumbers =
            Object.keys(
                HIDDEN_GROUPS
            ).map(Number);


        const impossibleGroups =
            hiddenGroupNumbers.filter(
                number =>
                    number > groupCount
            );


        /*
           Jika misalnya user membuat hanya
           5 kelompok, kelompok rahasia 6 dan 8
           tidak dapat digunakan.

           Kita tidak menghentikan proses.
           Sistem tetap membagi anggota secara normal.
        */


        if (
            impossibleGroups.length > 0
        ) {

            console.warn(
                "Beberapa kelompok rahasia berada di luar jumlah tim:",
                impossibleGroups
            );

        }


        /*
           Buat kelompok.
        */

        const groups =
            createGroups(names);


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
           Pilih perwakilan secara acak.
        */

        const selectedLeaders =
            chooseLeaders(groups);


        /*
           Nonaktifkan tombol selama proses.
        */

        spinButton.disabled = true;

        resetButton.disabled = true;

        amountInput.disabled = true;

        memberInput.disabled = true;


        document
            .querySelectorAll(
                'input[name="distributionMode"]'
            )
            .forEach(
                radio =>
                    radio.disabled = true
            );


        leaderToggle.disabled = true;

        leaderCount.disabled = true;


        /*
           Update status.
        */

        statusBadge.textContent =
            "Mengacak...";

        statusBadge.style.background =
            "#eef2ff";

        statusBadge.style.color =
            "#4f46e5";


        resultStatus.textContent =
            "Pembagian sedang diproses";


        groupsContainer.innerHTML = "";


        /*
           Jalankan animasi.
        */

        await playSpinAnimation(
            names,
            groups,
            selectedLeaders
        );


        /*
           Status akhir.
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
           Aktifkan kembali tombol.
        */

        spinButton.disabled = false;

        resetButton.disabled = false;

        amountInput.disabled = false;

        memberInput.disabled = false;


        document
            .querySelectorAll(
                'input[name="distributionMode"]'
            )
            .forEach(
                radio =>
                    radio.disabled = false
            );


        leaderToggle.disabled = false;

        leaderCount.disabled = false;

    }
);


/* =========================================================
   RESET
========================================================= */


resetButton.addEventListener(
    "click",
    () => {

        memberInput.value = "";

        groupsContainer.innerHTML = "";

        groupsContainer.style.display =
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
   INITIAL STATE
========================================================= */


groupsContainer.style.display =
    "none";


leaderCountWrapper.style.display =
    leaderToggle.checked
        ? "block"
        : "none";


updateMemberCount();

updateDistributionLabel();