const fs = require('fs');
const { Efekt } = require('./models/efekty')
const { Przedmiot } = require('./models/przedmioty')

const efekty = JSON.parse(fs.readFileSync('./data/efekty.json', 'utf8'));
const IIST = JSON.parse(fs.readFileSync('./data/IIST-sylabus.json', 'utf8'));

const prepareData = async () => {
  console.log('Preparing data...');

  try {
    await Efekt.deleteMany({});
    console.log('Items deleted successfully!');
  } catch (error) {
    console.error('Error deleting items:', error);
  }

  try {
    await Przedmiot.deleteMany({});
    console.log('Items deleted successfully!');
  } catch (error) {
    console.error('Error deleting items:', error);
  }

  const mappedEfekt = await Promise.all(efekty.map(async (data) => {
    return {
      kod: data["kod"],
      nazwa: data["efekt"],
      kategoria: extractEffectCategory(data["kod"])
    };
  }));

  const mappedPrzedmioty = await Promise.all(IIST.map(async (data) => {
    return {
      kod: data['kod'],
      nazwa: data['nazwa'],
      rok: extractYear(data['kod']),
      semestr: extractSemester(data['kod']),
      obieralny: obieralnyToBoolean(data['obieralny']),
      specjalizacja: extractSpecjalizacja(data['kod']),
      efekty: data['efekty'],
    }
  }))

  console.log(mappedPrzedmioty)


  try {
    await Efekt.insertMany(mappedEfekt);
    console.log('Items inserted successfully!');
  } catch (error) {
    console.error('Error inserting items:', error);
  }

  try {
    await Przedmiot.insertMany(mappedPrzedmioty);
    console.log('Items inserted successfully!');
  } catch (error) {
    console.error('Error inserting items:', error);
  }
};



const extractEffectCategory = (kod) => {
  if (kod && typeof kod === 'string') {
    const underscoreIndex = kod.indexOf('_');
    if (underscoreIndex !== -1 && underscoreIndex < kod.length - 1) {
      if (kod.charAt(underscoreIndex + 1) === 'W') {
        return 'wiedza';
      } else if (kod.charAt(underscoreIndex + 1) === 'U') {
        return 'umiejętność';
      } else if (kod.charAt(underscoreIndex + 1) === 'K') {
        return 'kompetencje społeczne';
      }
    }
  }
  return "";
};

const obieralnyToBoolean = (obj) => {
  if (obj === "nie") {
    return false;
  } else if (obj === "tak") {
    return true;
  }
  return false;
}

const extractYear = (kod) => {
  if (kod && typeof kod === 'string') {
    const dotIndex = kod.indexOf('.');
    if (dotIndex !== -1 && dotIndex < kod.length - 1) {
      return Math.floor((Number(kod.charAt(dotIndex - 1))+1)/2)
    }
  }
  return -1;
}

const extractSemester = (kod) => {
  if (kod && typeof kod === 'string') {
    const dotIndex = kod.indexOf('.');
    if (dotIndex !== -1 && dotIndex < kod.length - 1) {
      return kod.charAt(dotIndex - 1)
    }
  }
  return -1;
}


const extractSpecjalizacja = (kod) => {
  const firstDotIndex = kod?.indexOf('.');
  const secondDotIndex = kod?.indexOf('.', firstDotIndex + 1);

  if (firstDotIndex !== -1 && secondDotIndex !== -1 && secondDotIndex > firstDotIndex + 1) {
    return kod.slice(firstDotIndex + 1, secondDotIndex);
  }

  return "";
};

module.exports = { prepareData };
