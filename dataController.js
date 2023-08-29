const {Efekt} = require('./models/efekty')
const {Przedmiot} = require('./models/przedmioty')

const getSpecializationsSubjects = async (req, res) => {
  const { specialization } = req.params;
  const data = await Przedmiot.find({ semestr: 7, specjalizacja: specialization }).select([ 'kod', 'nazwa']);
  let result = {
    0: [],
    1: [],
    2: []
  }
  data.map((item) => {
    let num = item['kod'].charAt(item['kod'].length - 1)
    if( num === '2' || num === '3' || num === '4'){
      result[0].push(item)
    }else if (num === '5' || num === '6' || num === '7'){
      result[1].push(item)
    }else if (num === '8' || num === '9') {
      result[2].push(item)
    }
  })
  res.send(result);
};

const prepareDataForEffectProgress = async (specjalizacja, przedmiot1, przedmiot2, przedmiot3) => {

  if (specjalizacja === ''){
    return await Przedmiot.find({obieralny: false})
  }else {
    if (przedmiot1 === '' && przedmiot2 === '' && przedmiot3 === '') {
      return await Przedmiot.find({$or: [{
        obieralny: false
      }, {$and: [{obieralny: true}, {specjalizacja: specjalizacja}]}]})
    } else {
  return await Przedmiot.find({$or: [
    {obieralny: false}, 
    {$and: [{obieralny: true}, {$or: [
      {$and: [{semestr: {$lt: 7}, specjalizacja: specjalizacja}]},
      {$and: [{semestr: 7}, {$or: [{kod: przedmiotObieralny1}, {kod: przedmiotObieralny2}, {kod: przedmiotObieralny3}, {kod: "IIS7." + specjalizacja + ".1"}]}]}
  ]}]}]})
    }
  }

}

const getEffectProgress1 = async (req, res) => {
  const semestr = req.body.semestr
  const przedmioty = await prepareDataForEffectProgress(req.body.specjalizacja, req.body.przedmiotObieralny1, req.body.przedmiotObieralny2, req.body.przedmiotObieralny3)

  const wszystkieEfektyPrzedmiotow = []
  przedmioty.map((data) => {
    wszystkieEfektyPrzedmiotow.push(...data['efekty'])
  })
  const wszystkieDictionary = countOccurrences(wszystkieEfektyPrzedmiotow)

  const zdobyteEfektyPrzedmiotow = []
  przedmioty.filter(item => item['semestr']<semestr).map((data) => {
    zdobyteEfektyPrzedmiotow.push(...data['efekty'])
  })

  const zdobyteDictionary = countOccurrences(zdobyteEfektyPrzedmiotow)

  const zdobywaneEfektyPrzedmiotow = []
  przedmioty.filter(item => item['semestr']==semestr).map((data) => {
    zdobywaneEfektyPrzedmiotow.push(...data['efekty'])

  })
  const zdobywaneDictionary = countOccurrences(zdobywaneEfektyPrzedmiotow)

  const przyszleEfektyPrzedmiotow = []
  przedmioty.filter(item => item['semestr']>semestr).map((data) => {
    przyszleEfektyPrzedmiotow.push(...data['efekty'])
  })
  const przyszleDictionary = countOccurrences(przyszleEfektyPrzedmiotow)

  const efekty = await Efekt.find({})


  const result = efekty.map((data) => {
    return {
      kod: data['kod'],
      nazwa: data['nazwa'],
      wszystkie: (wszystkieDictionary[data['kod']] || 0),
      przed: (zdobyteDictionary[data['kod']] || 0),
      teraz: (zdobywaneDictionary[data['kod']] || 0),
      po: (przyszleDictionary[data['kod']] || 0)
    }
  })
res.send(JSON.stringify(result));
}

const getEffectProgress = async (req, res) => {
  const semestr = req.body.semestr;
  const przedmioty = await prepareDataForEffectProgress(req.body.specjalizacja, req.body.przedmiotObieralny1, req.body.przedmiotObieralny2, req.body.przedmiotObieralny3);
  const efekty = await Efekt.find({});

  let result = efekty.map((data) => {
    return {
      kod: data['kod'],
      nazwa: data['nazwa'],
      wszystkie: 0,
      przed: 0,
      teraz: 0,
      po: 0,
      przedPrzedmioty: [],
      terazPrzedmioty: [],
      poPrzedmioty: [],
    }
  });

  przedmioty.forEach((przedmiot) => {
    przedmiot.efekty.forEach((efekt) => {
      let resultItem = result.find((item) => item.kod === efekt)
      
      if(przedmiot.semestr < semestr){
        result.find((item) => item.kod === efekt).przed += 1
        result.find((item) => item.kod === efekt).wszystkie += 1
        result.find((item) => item.kod === efekt).przedPrzedmioty.push({kod: przedmiot.kod, nazwa: przedmiot.nazwa})

      }else if (przedmiot.semestr == semestr){
        result.find((item) => item.kod === efekt).teraz += 1
        result.find((item) => item.kod === efekt).wszystkie += 1
        result.find((item) => item.kod === efekt).terazPrzedmioty.push({kod: przedmiot.kod, nazwa: przedmiot.nazwa})

      }else if (przedmiot.semestr > semestr){
        result.find((item) => item.kod === efekt).po += 1
        result.find((item) => item.kod === efekt).wszystkie += 1
        result.find((item) => item.kod === efekt).poPrzedmioty.push({kod: przedmiot.kod, nazwa: przedmiot.nazwa})

      }
    })
  });
  res.send(JSON.stringify(result));
}

function countOccurrences(list) {
  var dictionary = {};

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (dictionary[item]) {
      dictionary[item]++;
    } else {
      dictionary[item] = 1;
    }
  }

  return dictionary;
}

const getSubjectCorrelationMatrix = async (req, res) => {
  let przedmioty = await mandatoryFilter(req.body.mandatory);
  console.log(przedmioty.length)
  przedmioty = await semestersFilter(przedmioty, req.body.semesters);
  const specialization = req.body.specializations;
  console.log(typeof specialization)
  if (req.body.mandatory.includes('obowiązkowe')) {specialization.push('')}
  przedmioty = await specializationFilter(przedmioty, req.body.specializations);
  przedmioty = await categoryFilter(przedmioty, req.body.categories);

  // Step 2: Extract relevant information 
  const subjects = {};
  przedmioty.forEach((przedmiot) => {
    const subjectCode = przedmiot.kod;
    const effects = przedmiot.efekty;
    subjects[subjectCode] = effects;
  });

  // Step 4: Compute the correlation matrix
  const subjectCodes = Object.keys(subjects);
  const numSubjects = subjectCodes.length;
  const correlationsList = []
  const correlationMatrix = [];
  for (let i = 0; i < numSubjects; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < numSubjects; j++) {
      const subject1 = subjectCodes[i];
      const subject2 = subjectCodes[j];
      const effects1 = subjects[subject1];
      const effects2 = subjects[subject2];
      const sharedEffects = effects1.filter((effect) =>
        effects2.includes(effect)
      );
      const similarityScore =
        (effects1.length !== 0 && effects2.length !== 0)
          ? sharedEffects.length / Math.max(effects1.length, effects2.length)
          : 0; 
      correlationMatrix[i][j] = similarityScore;
      if (i < j) {
        const subject1_name = przedmioty.find((przedmiot) => przedmiot.kod === subject1).nazwa
        const subject2_name = przedmioty.find((przedmiot) => przedmiot.kod === subject2).nazwa
        correlationsList.push({
          subject1,
          subject1_name,
          subject2,
          subject2_name,
          similarityScore,
        });
      }
    }
  }

  correlationsList.sort((a, b) => b.similarityScore - a.similarityScore);

  res.send({correlationMatrix, przedmioty, correlationsList});
};





const getGraphData = async (req, res) => {
  let przedmioty = await mandatoryFilter(req.body.mandatory);
  console.log(przedmioty.length)
  przedmioty = await semestersFilter(przedmioty, req.body.semesters);
  const specialization = req.body.specializations;
  console.log(typeof specialization)
  if (req.body.mandatory.includes('obowiązkowe')) {specialization.push('')}
  przedmioty = await specializationFilter(przedmioty, req.body.specializations);
  przedmioty = await categoryFilter(przedmioty, req.body.categories);
  const graph = {
    nodes: [],
    edges: [],
  };

  // Step 3: Add subjects as nodes to the graph
  przedmioty.forEach((przedmiot) => {
    const node = {
      id: przedmiot.kod,
      label: przedmiot.nazwa,
    };
    graph.nodes.push(node);
  });

  // Step 4: Add effects as edges to the graph
  przedmioty.forEach((przedmiot) => {
    const sourceNodeId = przedmiot.kod;
    const sourceNodeEfekty = przedmiot.efekty;

    przedmioty.forEach((przedmiotToCheck) => {
      const targetNodeId = przedmiotToCheck.kod;
      const targetNodeEfekty = przedmiotToCheck.efekty;

      if (
        sourceNodeId !== targetNodeId &&
        hasCommonElements(sourceNodeEfekty, targetNodeEfekty)
      ) {
        const commonEfekty = getCommonElements(sourceNodeEfekty, targetNodeEfekty);
        const connection = {
          source: sourceNodeId,
          target: targetNodeId,
          id: sourceNodeId + '-' + targetNodeId,
          label: '' + commonEfekty.length, // Weight is the number of common effects
        };

        graph.edges.push(connection);
      }
    });
  });

  res.send(graph);
};

// Helper function to check if two arrays have common elements
function hasCommonElements(array1, array2) {
  return array1.some((element) => array2.includes(element));
}

// Helper function to get the common elements between two arrays
function getCommonElements(array1, array2) {
  return array1.filter((element) => array2.includes(element));
}

async function mandatoryFilter(mandatory) {
  if (mandatory.length === 0) {
    return []
  } else if (mandatory.includes('obieralne') && mandatory.includes('obowiązkowe')) {
    return await Przedmiot.find({});
  } else if (mandatory.includes('obieralne')) {
    return await Przedmiot.find({obieralny: true});
  } else if (mandatory.includes('obowiązkowe')) {
    return await Przedmiot.find({obieralny: false});
  }
}

async function semestersFilter(przedmioty, semesters){
  if (semesters.length === 0) {
    return [];
  } else {
    return przedmioty.filter((przedmiot) => semesters.includes(przedmiot.semestr));
  }
}

async function specializationFilter(przedmioty, specializations){
  if (specializations.length === 0) {
    return [];
  } else {
    return przedmioty.filter((przedmiot) => specializations.includes(przedmiot.specjalizacja));
  }
}


async function categoryFilter(przedmioty, categories) {
  if (categories.length === 0) {
    return [];
  } else {
    const efekty = await Efekt.find({ kategoria: { $in: categories } });

    przedmioty.forEach((przedmiot) => {
      const updatedEfekty = przedmiot.efekty.filter((efekt) =>
        efekty.some((e) => e.kod === efekt)
      );
      przedmiot.efekty = updatedEfekty;
    });

    return przedmioty;
  }
}

async function getSubjectData(req, res) {
  const { kod } = req.params;
  const przedmiot = await Przedmiot.findOne({ kod: kod });
  console.log(przedmiot)
  const efekty = await Efekt.find({kod: {$in: przedmiot.efekty}});
  console.log(efekty)
  przedmiot.efekty = efekty
  res.send(przedmiot);
}

async function getSubjectsData(req, res) {
  let przedmioty = await mandatoryFilter(req.body.mandatory);
  console.log(przedmioty.length)
  przedmioty = await semestersFilter(przedmioty, req.body.semesters);
  const specialization = req.body.specializations;
  console.log(typeof specialization)
  if (req.body.mandatory.includes('obowiązkowe')) {specialization.push('')}
  przedmioty = await specializationFilter(przedmioty, req.body.specializations);
  przedmioty = await categoryFilter(przedmioty, req.body.categories);
  const efekty = await Efekt.find({})

  przedmioty.forEach((przedmiot) => {
    const updatedEfekty = []
    przedmiot.efekty.forEach((efekt) => {
      const efektToAdd = efekty.find((e) => e.kod === efekt)
      updatedEfekty.push(efektToAdd)
    })
    przedmiot.efekty = updatedEfekty
  })
  res.send(przedmioty)

}



module.exports = {
  getSpecializationsSubjects,
  getEffectProgress,
  getSubjectCorrelationMatrix,
  getGraphData,
  getSubjectData,
  getSubjectsData
};

