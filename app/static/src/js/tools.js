const categorySelect = document.getElementById("category-select");
const subcategorySelect = document.getElementById("subcategory-select");
const rollButton = document.getElementById("roll-button");

const categories = {
  Bestiary: {
    "Random Monster": data["Random Monster"],
    "Custom Monster": data["Custom Monster"],
  },
  Events: {
    "Dungeon Events": data["Dungeon Events"],
    "Wilderness Events": data["Wilderness Events"],
  },
  Weather: data.Weather.Types,
  // Names: data.Names.NameFormulas,
  "World Building": {
    Dungeon: data.Dungeon,
    // Forest: data.Forest,
    Realm: data.Realm,
  },
  Items: {
    Relics: data.Relics,
    Spellbooks: data.Spellbooks,
  },
};

const addOptionsToSelect = (data, element) => {
  element.innerHTML = '<option value="" selected disabled>Choose...</option>';
  for (let key in data) {
    let option = document.createElement("option");
    option.value = key;
    option.text = key;
    element.add(option);
  }
};

addOptionsToSelect(categories, categorySelect);

categorySelect.addEventListener("change", () => {
  const selectedCategory = categories[categorySelect.value];
  addOptionsToSelect(selectedCategory, subcategorySelect);
});

rollButton.addEventListener("click", () => {
  const category = categorySelect.value;
  const subcategory = subcategorySelect.value;

  switch (category) {
    case "Bestiary":
      rollBestiary(categories.Bestiary, subcategory);
      break;
    case "Events":
      rollEvents(categories.Events, subcategory);
      break;
    case "Weather":
      rollWeather(data.Weather, subcategory);
      break;
    case "Realm":
      rollRealm(categories.Realm, subcategory);
      break;
    case "World Building":
      rollLocations(categories["World Building"], subcategory);
      break;
    case "Items":
      rollRelics(categories.Items, subcategory);
      break;
  }
});

const roll = (sides) => {
  return Math.floor(Math.random() * sides);
};

const formatObjectToString = (obj) => {
  return Object.entries(obj)
    .filter(([key, value]) => !(Array.isArray(value) && value.length === 0))
    .map(([key, value]) => {
      let formattedValue = Array.isArray(value) ? value.join(", ") : value;
      return `<b>${key}:</b> ${formattedValue}`;
    })
    .join("<br>");
};

const displayResult = (result) => {
  const resultDisplay = document.getElementById("tools-result-display");
  const height = resultDisplay.scrollHeight;
  const line = "------------------------------------<br>";
  if (resultDisplay.innerHTML === "no events yet...") {
    resultDisplay.innerHTML = result + "<br><br>" + line;
  } else {
    resultDisplay.innerHTML = resultDisplay.innerHTML + `<p>${result}</p>` + line;
  }
  resultDisplay.scrollTop = height;
};

const rollBestiary = (data, subcategory) => {
  const bestiary = data[subcategory];
  if (subcategory === "Random Monster") {
    const result = bestiary[roll(bestiary.length)];
    const textResult = `<b><u>Random Monster</u></b><br><br><b>Name:</b> ${result.Name}<br><b>HP:</b> ${result.HP},${
      result.Armor ? ` <b>Armor:</b> ${result.Armor},` : ""
    } <b>STR:</b> ${result.STR}, <b>DEX:</b> ${result.DEX}, <b>WIL:</b> ${result.WIL}<br>${
      result.Attack ? `<b>Attack:</b> ${result.Attack}<br>` : ""
    }<b>Traits:</b> ${result.Traits.join("<br>")}`;
    displayResult(textResult);
  } else if (subcategory === "Custom Monster") {
    const physique = bestiary.MonsterAppearance.Physique[roll(bestiary.MonsterAppearance.Physique.length)];
    const feature = bestiary.MonsterAppearance.Feature[roll(bestiary.MonsterAppearance.Feature.length)];
    const quirks = bestiary.MonsterTraits.Quirks[roll(bestiary.MonsterTraits.Quirks.length)];
    const weakness = bestiary.MonsterTraits.Weakness[roll(bestiary.MonsterTraits.Weakness.length)];
    const attack = bestiary.MonsterAttacks.Type[roll(bestiary.MonsterAttacks.Type.length)];
    const criticalDamage = bestiary.MonsterAttacks.CriticalDamage[roll(bestiary.MonsterAttacks.CriticalDamage.length)];
    const ability = bestiary.MonsterAbilities.Ability[roll(bestiary.MonsterAbilities.Ability.length)];
    const target = bestiary.MonsterAbilities.Target[roll(bestiary.MonsterAbilities.Target.length)];
    const textResult = `<b><u>Custom Monster</u></b><br><br><b>Physique:</b> ${physique}<br><b>Feature:</b> ${feature}<br><b>Quirks:</b> ${quirks}<br><b>Weakness:</b> ${weakness}<br><b>Attack:</b> ${attack}<br><b>Critical Damage:</b> ${criticalDamage}<br><b>Ability:</b> ${ability}<br><b>Target:</b> ${target}`;
    displayResult(textResult);
  }
};

const rollEvents = (data, subcategory) => {
  const events = data[subcategory];
  if (subcategory === "Dungeon Events") {
    const result = events[roll(events.length)];
    const textResult = `<b><u>Dungeon Event</u></b><br><br>${result.description}`;
    displayResult(textResult);
  } else if (subcategory === "Wilderness Events") {
    const result = events[roll(events.length)];
    const textResult = `<b><u>Wilderness Event</u></b><br><br>${result.description}`;
    displayResult(textResult);
  }
};

const rollWeather = (data, subcategory) => {
  console.log(data);
  const weather = data.Types[subcategory];
  const type = weather[roll(weather.length)];
  console.log(type);
  const difficulty = data.Difficulty[type];
  const textResult = `<b><u>Weather</u></b><br><br><b>Season:</b> ${subcategory}<br><b>Type:</b> ${type}<br><b>Effect:</b> ${difficulty.Effect} <br><b>Examples:</b> ${difficulty.Examples}`;
  displayResult(textResult);
};

const formatNumberedArrayToString = (arr) => {
  return arr.map((item, index) => `${index + 1}. ${item}`).join("<br>");
};

const rollRelics = (data, subcategory) => {
  const items = data[subcategory];
  const result = items[roll(items.length)];
  const textResult = `<b><u>${subcategory.substring(0, subcategory.length - 1)}</u></b><br><br>${formatObjectToString(
    result
  )}`;

  displayResult(textResult);
};

// const convertName = (nameFormula, noun, adjective, type) => {
//   let name = nameFormula;

//   if (name.includes("[Noun]")) {
//     name = name.replace("[Noun]", noun);
//   }
//   if (name.includes("[Adjective]")) {
//     name = name.replace("[Adjective]", adjective);
//   }
//   if (name.includes("[Group]")) {
//     name = name.replace("[Group]", type);
//   }
//   return name;
// };

const convertName = (nameFormula, replacements) => {
  let name = nameFormula;

  replacements.forEach(({ type, word }) => {
    const regex = new RegExp(`\\[${type}\\]`, "g");
    name = name.replace(regex, word);
  });

  // Remove optional parts if their content wasn't replaced
  name = name.replace(/\([^()]*\[.*?\][^()]*\)/g, "");
  // Remove any remaining brackets
  name = name.replace(/[\[\]()]/g, "");
  // Trim any extra spaces
  return name.trim().replace(/\s+/g, " ");
};

const rollLocations = (data, subcategory) => {
  const setting = data[subcategory];
  let result = {};

  if (subcategory === "Dungeon") {
    result.Purpose = {
      "Original Use": setting.Properties.Purpose.OriginalUse[roll(setting.Properties.Purpose.OriginalUse.length)],
      "Built By": setting.Properties.Purpose.BuiltBy[roll(setting.Properties.Purpose.BuiltBy.length)],
    };
    result.Construction = {
      Entrance: setting.Properties.Construction.Entrance[roll(setting.Properties.Construction.Entrance.length)],
      Composition:
        setting.Properties.Construction.Composition[roll(setting.Properties.Construction.Composition.length)],
    };
    result.Ruination = {
      Condition: setting.Properties.Ruination.Condition[roll(setting.Properties.Ruination.Condition.length)],
      Cause: setting.Properties.Ruination.Cause[roll(setting.Properties.Ruination.Cause.length)],
    };
    result.Factions = {
      ["Virtue"]: setting.Properties.Factions.Traits.Virtue[roll(setting.Properties.Factions.Traits.Virtue.length)],
      ["Vice"]: setting.Properties.Factions.Traits.Vice[roll(setting.Properties.Factions.Traits.Vice.length)],
      ["Goal"]: setting.Properties.Factions.Agendas.Goal[roll(setting.Properties.Factions.Agendas.Goal.length)],
      ["Obstacle"]:
        setting.Properties.Factions.Agendas.Obstacle[roll(setting.Properties.Factions.Agendas.Obstacle.length)],
    };

    // POIs
    const min = setting.POIs.Repeat.Min;
    const max = setting.POIs.Repeat.Max;
    const repeat = Math.floor(Math.random() * (max - min + 1)) + min;
    result.POIs = [];
    let groups = [];
    for (let group in setting.POIs.Monster.Group) {
      groups.push(group);
    }
    for (let i = 0; i < repeat; i++) {
      const poi = setting.POIs.DungeonDieDropTable[roll(setting.POIs.DungeonDieDropTable.length)];
      if (poi === "Monster") {
        const monsterGroup = groups[roll(groups.length)];
        const monsterType =
          setting.POIs.Monster.Group[monsterGroup][roll(setting.POIs.Monster.Group[monsterGroup].length)];
        const activity = setting.POIs.Monster.Activity[roll(setting.POIs.Monster.Activity.length)];
        result.POIs.push(`Monster: ${activity} ${monsterType}`);
      }
      if (poi === "Lore") {
        const roomType = setting.POIs.Lore.RoomType[roll(setting.POIs.Lore.RoomType.length)];
        const clue = setting.POIs.Lore.Clue[roll(setting.POIs.Lore.Clue.length)];
        result.POIs.push(`Lore: ${roomType} ${clue}`);
      }
      if (poi === "Special") {
        const special = setting.POIs.Special.Special[roll(setting.POIs.Special.Special.length)];
        const feature = setting.POIs.Special.Feature[roll(setting.POIs.Special.Feature.length)];
        result.POIs.push(`Special: ${special} ${feature}`);
      }
      if (poi === "Trap") {
        const trap = setting.POIs.Trap.Trap[roll(setting.POIs.Trap.Trap.length)];
        const trigger = setting.POIs.Trap.Trigger[roll(setting.POIs.Trap.Trigger.length)];
        result.POIs.push(`Trap: ${trap} ${trigger}`);
      }
    }

    const textResult = `<b><u>Dungeon</u></b><br><br>${formatObjectToString(result.Purpose)}<br>${formatObjectToString(
      result.Construction
    )}<br>${formatObjectToString(result.Ruination)}<br><br><b><u>Factions</u></b><br>${formatObjectToString(
      result.Factions
    )}<br><br><b><u>Rooms:</u></b><br>${formatNumberedArrayToString(result.POIs)}`;
    displayResult(textResult);
  } else if (subcategory === "Forest") {
  } else if (subcategory === "Realm") {
    result.Culture = {
      Character: setting.Theme.People.Culture.Character[roll(setting.Theme.People.Culture.Character.length)],
      Ambition: setting.Theme.People.Culture.Ambition[roll(setting.Theme.People.Culture.Ambition.length)],
    };
    result.Resources = {
      Abundance: setting.Theme.People.Resources.Abundance[roll(setting.Theme.People.Resources.Abundance.length)],
      Scarcity: setting.Theme.People.Resources.Scarcity[roll(setting.Theme.People.Resources.Scarcity.length)],
    };

    // Factions
    const advantageNumber =
      setting.Theme.Factions.FactionAdvantages.NumberOfAdvantages[
        roll(setting.Theme.Factions.FactionAdvantages.NumberOfAdvantages.length)
      ];
    let advantages = [];
    for (let i = 0; i < advantageNumber; i++) {
      advantages.push(
        setting.Theme.Factions.FactionAdvantages.Advantage[
          roll(setting.Theme.Factions.FactionAdvantages.Advantage.length)
        ]
      );
    }
    const nameFormula =
      setting.Theme.Factions.FactionNames.NameFormulas.Faction[
        roll(setting.Theme.Factions.FactionNames.NameFormulas.Faction.length)
      ];
    const adjective =
      setting.Theme.Factions.FactionNames.Adjectives[roll(setting.Theme.Factions.FactionNames.Adjectives.length)];
    const noun = setting.Theme.Factions.FactionNames.Nouns[roll(setting.Theme.Factions.FactionNames.Nouns.length)];
    const type =
      setting.Theme.Factions.FactionNames.FactionTypes[roll(setting.Theme.Factions.FactionNames.FactionTypes.length)];

    // const name = convertName(nameFormula, noun, adjective, type);

    const name = convertName(nameFormula, [
      { type: "Noun", word: noun },
      { type: "Adjective", word: adjective },
      { type: "Group", word: type },
    ]);

    result.Factions = {};
    result.Factions = {
      Name: name,
      Type: setting.Theme.Factions.FactionTypes.Type[roll(setting.Theme.Factions.FactionTypes.Type.length)],
      Agent: setting.Theme.Factions.FactionTypes.Agent[roll(setting.Theme.Factions.FactionTypes.Agent.length)],
      "Trait 1": setting.Theme.Factions.FactionTraits.Trait1[roll(setting.Theme.Factions.FactionTraits.Trait1.length)],
      "Trait 2": setting.Theme.Factions.FactionTraits.Trait2[roll(setting.Theme.Factions.FactionTraits.Trait2.length)],
      Advantages: advantages.join(", "),
      Agenda: setting.Theme.Factions.FactionAgendas.Agenda[roll(setting.Theme.Factions.FactionAgendas.Agenda.length)],
      Obstacle:
        setting.Theme.Factions.FactionAgendas.Obstacle[roll(setting.Theme.Factions.FactionAgendas.Obstacle.length)],
    };

    // set terrain count to a random number 1-6
    const terrainCount = Math.floor(Math.random() * 6) + 1;
    result.Terrain = [];
    for (let i = 0; i < terrainCount; i++) {
      const difficulty = setting.Topography.Difficulty[roll(setting.Topography.Difficulty.length)];
      const terrain = `${
        setting.Topography.Terrain[difficulty].Terrain[roll(setting.Topography.Terrain[difficulty].Terrain.length)]
      }. Difficulty: ${difficulty}. Landmark: ${
        setting.Topography.Terrain[difficulty].Landmark[roll(setting.Topography.Terrain[difficulty].Landmark.length)]
      }.
     `;
      result.Terrain.push(terrain);
    }

    result.Weather = {
      Spring: setting.Weather.SeasonalWeather.Spring[roll(setting.Weather.SeasonalWeather.Spring.length)],
      Summer: setting.Weather.SeasonalWeather.Summer[roll(setting.Weather.SeasonalWeather.Summer.length)],
      Fall: setting.Weather.SeasonalWeather.Fall[roll(setting.Weather.SeasonalWeather.Fall.length)],
      Winter: setting.Weather.SeasonalWeather.Winter[roll(setting.Weather.SeasonalWeather.Winter.length)],
      ["Unusual Weather (optional)"]: setting.Weather.UnusualWeather[roll(setting.Weather.UnusualWeather.length)],
    };

    const poiCount = Math.floor(Math.random() * (8 - 3 + 1)) + 3;
    result.POIs = [];
    for (let i = 0; i < poiCount; i++) {
      let poi = "";

      const poiNameForumla = setting.Names.NameFormulas.POI[roll(setting.Names.NameFormulas.POI.length)];
      const adjective = setting.Names.Adjectives[roll(setting.Names.Adjectives.length)];
      const noun = setting.Names.Nouns[roll(setting.Names.Nouns.length)];
      const type = setting.PointsOfInterest.POI[roll(setting.PointsOfInterest.POI.length)];
      const poiName = convertName(poiNameForumla, [
        { type: "Noun", word: noun },
        { type: "Adjective", word: adjective },
        { type: "POI", word: type },
      ]);

      if (type === "Waypoint") {
        poi = `${poiName}: ${
          setting.PointsOfInterest.Waypoints.Waypoint[roll(setting.PointsOfInterest.Waypoints.Waypoint.length)]
        }, 
        ${setting.PointsOfInterest.Waypoints.Feature[roll(setting.PointsOfInterest.Waypoints.Feature.length)]}`;
      } else if (type === "Settlement") {
        poi = `${poiName}: ${
          setting.PointsOfInterest.Settlements.Settlement[roll(setting.PointsOfInterest.Settlements.Settlement.length)]
        }, ${setting.PointsOfInterest.Settlements.Feature[roll(setting.PointsOfInterest.Settlements.Feature.length)]}`;
      } else if (type === "Curiosity") {
        poi = `${poiName}: ${
          setting.PointsOfInterest.Curiosities.Curiosity[roll(setting.PointsOfInterest.Curiosities.Curiosity.length)]
        }, ${setting.PointsOfInterest.Curiosities.Feature[roll(setting.PointsOfInterest.Curiosities.Feature.length)]}`;
      } else if (type === "Lair") {
        poi = `${poiName}: ${setting.PointsOfInterest.Lairs.Lair[roll(setting.PointsOfInterest.Lairs.Lair.length)]}, ${
          setting.PointsOfInterest.Lairs.Feature[roll(setting.PointsOfInterest.Lairs.Feature.length)]
        }`;
      } else if (type === "Dungeon") {
        poi = `${poiName}: ${
          setting.PointsOfInterest.Dungeons.Type[roll(setting.PointsOfInterest.Dungeons.Type.length)]
        }, ${setting.PointsOfInterest.Dungeons.Feature[roll(setting.PointsOfInterest.Dungeons.Feature.length)]}`;
      }
      result.POIs.push(poi);
    }

    const realmNameFormula = setting.Names.NameFormulas.Realm[roll(setting.Names.NameFormulas.Realm.length)];
    const realmAdjective = setting.Names.Adjectives[roll(setting.Names.Adjectives.length)];
    const realmNoun = setting.Names.Nouns[roll(setting.Names.Nouns.length)];
    const realmRulerType = setting.Names.RulerTypes[roll(setting.Names.RulerTypes.length)];
    console.log("ruler: ", realmRulerType);
    const realmName = convertName(realmNameFormula, [
      { type: "Noun", word: realmNoun },
      { type: "Adjective", word: realmAdjective },
      { type: "Rulers", word: realmRulerType },
    ]);

    const textResult = `<b><u>Realm</u></b><br><br>
    <b>${realmName}</b><br><br>
    <b><u>People</u></b><br>${formatObjectToString(result.Culture)}<br>${formatObjectToString(
      result.Resources
    )}<br><br><b><u>Factions</u></b><br>${formatObjectToString(
      result.Factions
    )}<br><br><b><u>Terrain</u></b><br>${formatNumberedArrayToString(
      result.Terrain
    )}<br><br><b><u>Weather</u></b><br>${formatObjectToString(
      result.Weather
    )}<br><br><b><u>Points of Interest</u></b><br>${formatNumberedArrayToString(result.POIs)}`;
    displayResult(textResult);
  }
};
