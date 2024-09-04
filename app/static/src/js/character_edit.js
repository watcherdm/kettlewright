import inventory from "./inventoryData.js";
import inventoryUI from "./inventoryUI.js";
import inventoryModalUI from "./inventoryModalUI.js";
import portraitModal from "./edit_portrait_modal.js";
import marketplace from "./marketplace.js";

let mode = "edit";

// Initialize inventory
inventory.setItems(itemsData);
inventory.setContainers(containersData);
inventoryModalUI.initialize();
inventoryUI.initialize();
inventoryUI.setMode("edit");

// Initialize portrait modal
portraitModal.initialize("edit", customImage == "True" ? true : false, imageURL);
document.getElementById("portrait-image").addEventListener("click", () => {
  if (mode == "edit") {
    portraitModal.openModal();
  }
});

// Initialize marketplace
function setGold(value) {
  gold = value;
  document.getElementById("gold-input").value = gold;
  // document.getElementById("gold-view-text").textContent = gold;
}
marketplace.initialize(marketplaceData, "marketplace", gold, (items) => inventory.addItems(items), setGold);

// Deprived and Rest
if (deprived == "true") {
  deprived = true;
} else {
  deprived = false;
}

// const deprivedContainer = document.getElementById("deprived-grid-container");
const deprivedField = document.getElementById("deprived-field");
const restButton = document.getElementById("character-rest-button");

deprivedField.addEventListener("change", function () {
  if (deprivedField.checked) {
    setDeprived(true);
  } else {
    setDeprived(false);
  }
});

function setDeprived(state) {
  if (state === true) {
    deprived = true;
    deprivedField.checked = true;
    restButton.classList.add("inactive");
    deprived;
  } else {
    deprived = false;
    deprivedField.checked = false;
    restButton.classList.remove("inactive");
  }
}

restButton.addEventListener("click", function () {
  document.getElementById("hp-input").value = hpMax;
});

// Resize textareas
document.addEventListener("DOMContentLoaded", function () {
  const textareas = document.getElementsByClassName("textarea");
  for (let i = 0; i < textareas.length; i++) {
    resizeTextarea(textareas[i]);
  }
});

// Convert <br> to newline when editing text
function convertBrToNewline(str) {
  str = str.replace(/<br\s*[\/]?>/gi, "\n");
  // don't allow more than three new line breaks in a row
  str = str.replace(/\n{4,}/g, "\n\n\n");
  return str;
}

document.getElementById("notes-field").value = convertBrToNewline(document.getElementById("notes-field").value);
document.getElementById("bonds-field").value = convertBrToNewline(document.getElementById("bonds-field").value);
document.getElementById("omens-field").value = convertBrToNewline(document.getElementById("omens-field").value);
document.getElementById("scars-field").value = convertBrToNewline(document.getElementById("scars-field").value);
document.getElementById("traits-field").value = convertBrToNewline(document.getElementById("traits-field").value);
document.getElementById("description-field").value = convertBrToNewline(
  document.getElementById("description-field").value
);

// Roll Scars and Omens

const roll = (sides) => {
  return Math.floor(Math.random() * sides);
};

document.getElementById("roll-scars-button").addEventListener("click", function () {
  const scars = document.getElementById("scars-field");
  const result = scarsData[roll(scarsData.length)].description;
  if (scars.value.trim() === "") {
    scars.value = result;
  } else {
    scars.value = scars.value + "\n\n" + result;
  }
  resizeTextarea(scars);
});

document.getElementById("roll-omens-button").addEventListener("click", function () {
  const omens = document.getElementById("omens-field");
  const result = omensData[roll(omensData.length)].description;
  if (omens.value.trim() === "") {
    omens.value = result;
  } else {
    omens.value = omens.value + "\n\n" + result;
  }
  resizeTextarea(omens);
});

// Party Editing

function togglePartyEditing() {
  if (partyName != "None") {
    document.getElementById("character-leave-party-button").classList.remove("hidden");
    document.getElementById("character-join-code").classList.add("hidden");
  } else {
    document.getElementById("character-join-code").classList.remove("hidden");
    document.getElementById("add-item-modal-transfer").classList.add("hidden");
  }
}

togglePartyEditing();

// document.querySelectorAll(".edit-button").forEach((button) => {
//   button.addEventListener("click", function () {
//     inventoryUI.setMode("edit");
//     mode = "edit";
//     document.getElementById("portrait-image").classList.add("pointer");

//     document.querySelectorAll(".edit-mode").forEach((element) => {
//       element.classList.remove("hidden");
//       togglePartyEditing();
//     });
//     document.querySelectorAll(".view-mode").forEach((element) => {
//       element.classList.add("hidden");
//     });
//     document.querySelectorAll(".character-attribute-container").forEach((element) => {
//       // element.classList.remove("attribute-grid-container-view");
//       element.classList.add("character-attribute-container-edit");
//     });

//   });
// });

// Party Link
const partyLink = document.getElementById("character-party-link");

if (partyName != "None") {
  partyLink.addEventListener("click", function () {
    const link = `${baseURL}/${partyURL}`;
    window.location = link;
  });

  document.getElementById("character-leave-party-button").addEventListener("click", function () {
    document.getElementById("character-join-code").classList.remove("hidden");
    document.getElementById("party-code-field").value = "";
    document.getElementById("character-party-name-description").classList.add("hidden");
  });
} else {
  partyLink.classList.add("hidden");
  document.getElementById("character-party-description").classList.add("hidden");
}

// Copy Public Link
// document.getElementById("public-page-link").addEventListener("click", function () {
//   const link = `https://kettlewright.cairnrpg.com/users/${ownerUsername}/characters/${urlName}/`;
//   navigator.clipboard.writeText(link);
//   alert("Link copied to clipboard");
// });

// Cancel Button
document.getElementById("save-button-footer-cancel").addEventListener("click", function () {
  if (confirm("Cancel and lose all changes?")) {
    // window.location.reload(); // Reloads the current page
    window.location = `${baseURL}/users/${ownerUsername}/characters/${urlName}/`;
  }
});

// JSON download
// document.getElementById("download-json-button").addEventListener("click", function () {
//   const processValue = (value) => {
//     // Remove extra quotes if present
//     if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
//       value = value.slice(1, -1);
//     }
//     // Convert numeric strings to numbers
//     else if (!isNaN(value) && value.trim() !== "") {
//       value = Number(value);
//     }
//     return value;
//   };

//   const data = {
//     name: processValue(name),
//     background: processValue(background),
//     strength: processValue(strength),
//     strength_max: processValue(strengthMax),
//     dexterity: processValue(dexterity),
//     dexterity_max: processValue(dexterityMax),
//     willpower: processValue(willpower),
//     willpower_max: processValue(willpowerMax),
//     hp: processValue(hp),
//     hp_max: processValue(hpMax),
//     gold: processValue(gold),
//     description: processValue(description),
//     traits: processValue(traits),
//     bonds: processValue(bonds),
//     omens: processValue(omens),
//     scars: processValue(scars),
//     notes: processValue(notes),
//     items: inventory.getItems(),
//     containers: inventory.getContainers(),
//     custom_image: portraitModal.getCustomImage(),
//     image_url: portraitModal.getImageURL(),
//   };

//   // Convert it to JSON
//   const jsonString = JSON.stringify(data, null, 2);

//   // Create a blob with the JSON data
//   const blob = new Blob([jsonString], { type: "application/json" });

//   // Create a link element
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "data.json";

//   // Append the link to the body and trigger the download
//   document.body.appendChild(link);
//   link.click();

//   // Clean up
//   document.body.removeChild(link);
//   URL.revokeObjectURL(link.href);
// });

// Delete Button

document.getElementById("delete-character-button").addEventListener("click", function () {
  const characterId = this.getAttribute("data-character-id");
  console.log("delete button clicked", characterId);

  if (confirm("Are you sure you want to delete this character?")) {
    window.location.href = `/delete-character/${characterId}/`;
  }
});

// Submit Button

document.getElementById("character-form").addEventListener("submit", function (event) {
  const items = inventory.getItems();
  document.querySelector('input[name="items"]').value = JSON.stringify(items);
  const containers = inventory.getContainers();
  document.querySelector('input[name="containers"]').value = JSON.stringify(containers);
  // alert(portraitModal.getCustomImage());
  const customImage = portraitModal.getCustomImage();
  document.getElementById("custom_image").value = customImage;
  //portraitModal.getCustomImage();
  // alert(document.getElementById("custom-image").value);
  const transfer = inventory.getTransfer();
  document.getElementById("transfer").value = JSON.stringify(transfer);
  console.log("transfer: " + document.getElementById("transfer").value);
  document.getElementById("image_url").value = portraitModal.getImageURL();
  document.getElementById("armor").value = document.getElementById("armor-counter").textContent;
});
