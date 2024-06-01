//* Selectors
const newEntryInput = document.querySelector('.new-entry-input');
const newEntryBtn = document.querySelector('.new-entry-button');
const submitEntryBtn = document.querySelector('.submit-entry-button');
const cancelEntryBtn = document.querySelector('.cancel-entry-button');
const journalEntryList = document.querySelector('#journal-entry-list');
const entryTitleInput = document.querySelector('.new-entry-title');
const entryContentInput = document.querySelector('.new-entry-content');
const deleteEntryBtn = document.querySelector('.delete-icon-wrapper');
const editEntryBtn = document.querySelector('.edit-icon-wrapper');
const entryForm = document.querySelector('.entry-form');
const dateHeader = document.querySelector('#date-header');
const timeHeader = document.querySelector('#time-header');


getEntries();

//* Event Listeners
window.addEventListener('DOMContentLoaded', function() {
    headerData();
    this.setInterval(headerData, 1000);
});

newEntryBtn.addEventListener('click', showForm);
submitEntryBtn.addEventListener('click', addEntry);
cancelEntryBtn.addEventListener('click', cancelEntry);
journalEntryList.addEventListener('click', deleteEntry);



//* Functions 
function headerData() {
    document.getElementById('date-header').innerHTML = getHeaderDate();
    document.getElementById('time-header').innerHTML = getCurrentTime();
}

function createJournalDiv() {
    return document.createElement('div');
}

function createJournalParagraph() {
    return document.createElement('p');
}

function createJournalListItem() {
    return document.createElement('li');
}

function addEntry(event) {
    event.preventDefault();

    entries = checkLocalStorage();

    // Create LI
    const newJournalEntry = createJournalListItem()
    const entryID = generateEntryID();
    newJournalEntry.classList.add('journal-entry-item');
    newJournalEntry.classList.add(`${entryID}`);

    // Create JournalEntryDiv
    const journalEntryDiv = createJournalDiv();
    journalEntryDiv.classList.add('journal-card-content');
    newJournalEntry.appendChild(journalEntryDiv);

    // Construct Entry Header
    const journalEntryHeader = createJournalDiv();
    journalEntryHeader.classList.add('journal-content-header');
    journalEntryDiv.appendChild(journalEntryHeader);

    const entryDate = createJournalParagraph();
    entryDate.classList.add('entry-date');
    entryDate.innerText = getEntryDate();
    journalEntryHeader.appendChild(entryDate);

    const entryIcons = createJournalDiv();
    entryIcons.classList.add('entry-icons');
    journalEntryHeader.appendChild(entryIcons);

    const editIconWrapper = createJournalDiv();
    editIconWrapper.classList.add('edit-icon-wrapper');
    editIconWrapper.innerHTML = '<i class="edit-entry-icon fa-solid fa-pencil"></i>';
    entryIcons.appendChild(editIconWrapper);

    const deleteIconWrapper = createJournalDiv();
    deleteIconWrapper.classList.add('delete-icon-wrapper');
    deleteIconWrapper.innerHTML = '<i class="delete-entry-icon fa-solid fa-trash"></i>';
    entryIcons.appendChild(deleteIconWrapper);

    //Create entry time
    const entryTime = createJournalParagraph();
    entryTime.classList.add('entry-time');
    entryTime.innerText = getCurrentTime();
    journalEntryDiv.appendChild(entryTime);

    //Creat entry title
    const entryTitle = createJournalParagraph();
    entryTitle.classList.add('entry-title');
    entryTitle.innerText = entryTitleInput.value;
    journalEntryDiv.appendChild(entryTitle);

    //Create entry content
    const entryContent = createJournalParagraph();
    entryContent.classList.add('entry-content');
    entryContent.innerText = entryContentInput.value;
    journalEntryDiv.appendChild(entryContent);

    saveLocalEntries({entryID: generateEntryID(), date: getEntryDate(), time: getCurrentTime(), title: entryTitleInput.value, content: entryContentInput.value});
    journalEntryList.prepend(newJournalEntry);

    showForm();
    entryTitleInput.value = "";
    entryContentInput.value = "";

    console.log('u were looking for the weird bug issue here >:(', entries)

}

function cancelEntry(event) {
    event.preventDefault();
    showForm();
}

function deleteEntry(e) {
    const entry = e.target;
    // console.log('this is the e.target: ', entry)
    if(entry.classList[0] === 'delete-icon-wrapper'){
        const entryItem = entry.closest(".journal-entry-item");
        const entryID = entryItem.classList[1];
        removeLocalEntries(entryID);
        entryItem.classList.add('fall');
        entryItem.addEventListener('transitionend', function(){
            entryItem.remove();
        })
    }
}


function getEntries() {
    entries = checkLocalStorage();

    entries.forEach(function(entry){
        // Create LI
        const newJournalEntry = createJournalListItem()
        newJournalEntry.classList.add('journal-entry-item');
        newJournalEntry.classList.add(`${entry.entryID}`);

        // Create JournalEntryDiv
        const journalEntryDiv = createJournalDiv();
        journalEntryDiv.classList.add('journal-card-content');
        newJournalEntry.appendChild(journalEntryDiv);

        // Construct Entry Header
        const journalEntryHeader = createJournalDiv();
        journalEntryHeader.classList.add('journal-content-header');
        journalEntryDiv.appendChild(journalEntryHeader);

        const entryDate = createJournalParagraph();
        entryDate.classList.add('entry-date');
        entryDate.innerText = entry.date;
        journalEntryHeader.appendChild(entryDate);

        const entryIcons = createJournalDiv();
        entryIcons.classList.add('entry-icons');
        journalEntryHeader.appendChild(entryIcons);

        
        const editIconWrapper = createJournalDiv();
        editIconWrapper.classList.add('edit-icon-wrapper');
        editIconWrapper.innerHTML = '<i class="edit-entry-icon fa-solid fa-pencil"></i>';
        entryIcons.appendChild(editIconWrapper);

        const deleteIconWrapper = createJournalDiv();
        deleteIconWrapper.classList.add('delete-icon-wrapper');
        deleteIconWrapper.innerHTML = '<i class="delete-entry-icon fa-solid fa-trash"></i>';
        entryIcons.appendChild(deleteIconWrapper);

        //Create entry time
        const entryTime = createJournalParagraph();
        entryTime.classList.add('entry-time');
        entryTime.innerText = entry.time;
        journalEntryDiv.appendChild(entryTime);

        //Creat entry title
        const entryTitle = createJournalParagraph();
        entryTitle.classList.add('entry-title');
        entryTitle.innerText = entry.title;
        journalEntryDiv.appendChild(entryTitle);

        //Create entry content
        const entryContent = createJournalParagraph();
        entryContent.classList.add('entry-content');
        entryContent.innerText = entry.content;
        journalEntryDiv.appendChild(entryContent);

        journalEntryList.prepend(newJournalEntry);

    })
}



//* Helper Functions

// Return epoch 'number' for unique id per entry
function generateEntryID() {
    var uniqid = Date.now();
    return uniqid
}

function getEntryDate() {
    return todaysDate = new Date().toDateString();
}

function checkLocalStorage() {
    //Check---Hey do I already have things in there?
    let entries;
    if(localStorage.getItem('entries') === null){
        entries = [];
        return entries
    } else {
        entries = JSON.parse(localStorage.getItem('entries'));
        return entries
    };
}

function getCurrentTime() {
    var timeStr = "";
    var now = new Date();
    timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    return timeStr
}

function getHeaderDate() {
    var dateStr = "";
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };
    var now = new Date();
    dateStr = now.toLocaleDateString("en-US", options);
    return dateStr
}

function saveLocalEntries(entry) {
    checkLocalStorage();
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}

function removeLocalEntries(entry) {
    let entries = checkLocalStorage();
    const deletedEntry = entries.find(({entryID}) => entryID == entry);
    console.log(deletedEntry.entryID)

    entries.forEach(function(entry){
        if (deletedEntry.entryID == entry.entryID) {
            entries = entries.filter(function(a) {
                return a.entryID !== entry.entryID;
            })
        }
    })

    console.log('after it all', entries)

    localStorage.setItem('entries', JSON.stringify(entries));
}

function showForm() {
    entryForm.classList.toggle('show-form');
    newEntryBtn.classList.toggle('hide-entry-button');
}