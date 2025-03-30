enum MAJINS {
    FAT_MAJIN_BUU = "https://pa1.narvii.com/5858/8b61faaa49264942a3cf812503cccab83fe515a8_hq.gif",
    FAT_MAJIN_BUU_2 = "https://c.tenor.com/d9GvSsPKxe8AAAAM/majin-buu-buu.gif",
    FAT_MAJIN_BUU_3 = "https://www.laguiadelvaron.com/wp-content/uploads/2018/03/majin_bu_dog.gif", 
    FAT_MAJIN_BUU_4 = "https://c.tenor.com/xHMtksLVNlcAAAAC/dbz-gif.gif", 
    FAT_MAJIN_BUU_5 = "https://media.tenor.com/z5Y_hp08qAEAAAAC/buu-tongue.gif", 
    FAT_MAJIN_BUU_6 = "https://c.tenor.com/K3AE3cWEj3QAAAAM/eating-buu.gif", 
}

export function DEFAULT_AVATAR_URL() {
    const randomIndex = Math.floor(Math.random() * Object.keys(MAJINS).length);
    return Object.values(MAJINS)[randomIndex];
}