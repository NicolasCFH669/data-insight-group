// A) Crear el archivo main
let chamber = document.getElementById('house-data') ? 'house' : 'senate';
let urlApi = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;
let init = {
  method: 'GET',
  headers: {
    'X-API-Key': 'MyhXBFeR6PsmF1QpR3WNbxQFQxwhOIx8vmmzR66n'
  }
};

var tableElement = document.getElementById(`${chamber}-data`);
var docPartys = document.getElementById(`filters-${chamber}`);

let tableHousePartyNumbers = document.getElementById(`party-${chamber}`);
console.log(tableHousePartyNumbers)

const leastLoyal = document.getElementById('least-loyal');
const mostLoyal = document.getElementById('most-loyal');

var bodyEl = document.createElement('tbody');

const appendElements = (tableEl, arr) => {
  tableEl.appendChild(bodyEl);
  
  arr.forEach((member, index) => {
    let trEl = document.createElement('tr');
    trEl.innerHTML = `<td>${index +1}</td>
                      <td>${member.first_name}</td>
                      <td>${member.middle_name || ""}</td>
                      <td>${member.last_name}</td>
                      <td>${member.party}</td>
                      <td>${member.state}</td>
                      <td>${member.seniority}</td>
                      <td>${member.votes_with_party_pct} &#37;</td>
                      `;
    bodyEl.appendChild(trEl);
  });
};

const addFiltersMembers = (filterRes, arr, tblEl) => {
  
  filterRes.addEventListener('click', (evn) => {
    bodyEl.innerHTML = "";
    if(evn.target.id == 'D' || evn.target.id == 'R' || evn.target.id == 'ID'){
      getPartyandMembers(evn.target.id);
      console.log(evn.target.id)
      let filterPartyMembers = arr.filter(filterMember => filterMember.party == evn.target.id);
      appendElements(tblEl, filterPartyMembers);
    }
    if(evn.target.id == 'all'){
      appendElements(tblEl, arr);
    }
  });
};

const getPartyandMembers = (str) => {
  document.getElementById(str);
  // bodyEl.innerHTML = "";
};

const stateItems = document.getElementById('stateItem');

const drawStateByFilter = (arr, str, tblEl, arrByMember) => {
  arr.sort().forEach(stItem => {
    let liStates = document.createElement('li');
    liStates.innerHTML = `<a class='dropdown-item'>${stItem}</a>`;
    str.appendChild(liStates);
  });

  str.addEventListener('click', (evn) => {
    let infoMembers = [];
    bodyEl.innerHTML = "";

    arrByMember.forEach(sttFlt => {
      if(evn.target.innerText == sttFlt.state) {
        infoMembers.push(sttFlt);
      }
    });
    appendElements(tblEl, infoMembers);
    // console.log(infoMembers)
  })
}


const createTableAttendance = (arrayMembers, tableEl) => {
  let totalMembers = [0, 0];
  let totalDemocrats = [0, 0];
  let totalRepublicans = [0, 0];
  let totalIndependents = [0, 0];
  tableEl.appendChild(bodyEl);
  
  arrayMembers.forEach(member => {
    if(member.party == 'D') {
      totalDemocrats[0]+=1
      totalDemocrats[1] += member.votes_with_party_pct;
    };
    if(member.party == 'R') {
      totalRepublicans[0] +=1;
      totalRepublicans[1] += member.votes_with_party_pct;
    };
    if(member.party == 'ID') {
      totalIndependents[0] +=1;
      totalIndependents[1] += member.votes_with_party_pct;
    };
    totalMembers[0] +=1;
    totalMembers[1] += member.votes_with_party_pct;
  });

  bodyEl.innerHTML = `
                    <tr>
                      <td>Democrats</td>
                      <td class="text-center">${totalDemocrats[0]}</td>
                      <td class="text-center">${Math.round(totalDemocrats[1]/totalDemocrats[0])} &#37;</td>
                    </tr>
                    <tr>
                      <td>Republicans</td>
                      <td class="text-center">${totalRepublicans[0]}</td>
                      <td class="text-center">${Math.round(totalRepublicans[1] /totalRepublicans[0])} &#37;</td>
                    </tr>
                    <tr>
                      <td>Independents</td>
                      <td class="text-center">${totalIndependents[0]}</td>
                      <td class="text-center">${Math.round(totalIndependents[1]/totalIndependents[0]) || 0} &#37;</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td class="text-center">${totalMembers[0]}</td>
                      <td class="text-center">${Math.round(totalMembers[1] / totalMembers[0])} &#37;</td>
                    </tr>
                `;
}
const mostEngaged = document.getElementById('most-engaged');
const leastEngaged = document.getElementById('least-engaged');

const mostEngagesMembers = (arr, tableEl) => {
  let bodyMost = document.createElement('tbody');
  tableEl.appendChild(bodyMost);
  let cont = 0;
  
  arr.forEach((member) => {
    let trMost = document.createElement('tr');
    
    if(member.missed_votes_pct < 10){
      cont +=1;
      trMost.innerHTML = `
      <td>${cont} ${member.first_name} ${member.last_name}</td>
      <td class="text-center">${member.missed_votes}</td>
      <td class="text-center">${Math.round(member.missed_votes_pct)} &#37;</td>
      `;
      bodyMost.appendChild(trMost);
    }
  });
};

const leastEngageMembers = (arr, tableEl) => {
  let bodyLeast = document.createElement('tbody');
  tableEl.appendChild(bodyLeast);
  let cont = 0;

  let arrOrdenado = arr.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct);
  let leastEngaged = arrOrdenado.length * 0.1;
  for(let x = 0; x < leastEngaged; x++){
    console.log(arrOrdenado[x].first_name, arrOrdenado[x].missed_votes_pct)
    cont +=1;
    let trLeast = document.createElement('tr');
    trLeast.innerHTML = `
      <td>${cont} ${arrOrdenado[x].first_name} ${arrOrdenado[x].last_name}</td>
      <td class="text-center">${arrOrdenado[x].missed_votes}</td>
      <td class="text-center">${Math.round(arrOrdenado[x].missed_votes_pct)} &#37;</td>
      `;
      bodyLeast.appendChild(trLeast);
  }
  console.log(arrOrdenado.length)
  console.log(leastEngaged)

  // arr.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct).forEach((member) => {
  //   let trLeast = document.createElement('tr');
    
  //   if(member.missed_votes_pct >= 10){
  //     cont +=1;
  //     trLeast.innerHTML = `
  //     <td>${cont} ${member.first_name} ${member.last_name}</td>
  //     <td class="text-center">${member.missed_votes}</td>
  //     <td class="text-center">${Math.round(member.missed_votes_pct)} &#37;</td>
  //     `;
  //     bodyLeast.appendChild(trLeast);
  //   }
  // });
};



const drawLeastPartyLoyalty = (arr, tableEl) => {
  let drawBody = document.createElement('tbody');
  tableEl.appendChild(drawBody);

  arr.sort().forEach((member) => {
    let trBody = document.createElement('tr');
    
    if(member.votes_against_party_pct >= 10){
      trBody.innerHTML = `
          <td>${member.first_name} ${member.last_name}</td>
          <td class="text-center">${member.total_votes - member.missed_votes}</td>
          <td class="text-center">${Math.round(member.votes_against_party_pct)} &#37;</td>
      `;
      drawBody.appendChild(trBody)
      console.log(member.first_name,(member.total_votes - member.missed_votes), member.votes_against_party_pct);
    }

  })
};

const drawMostPartyLoyalty = (arr, tableEl) => {
  let drawbody = document.createElement('tbody');
  tableEl.appendChild(drawbody);

  arr.forEach((member) => {
    let trBody = document.createElement('tr');

    if(member.votes_against_party_pct < 10) {
      trBody.innerHTML = `
              <td>${member.first_name} ${member.last_name}</td>
              <td class="text-center">${(member.total_votes) - (member.missed_votes)}</td>
              <td class="text-center">${Math.round(member.votes_against_party_pct)} &#37;</td>
      `;
      drawbody.appendChild(trBody);
    }
  })
};

let allData = null;
var getData = () => {
  fetch(urlApi, init)
  .then(response => response.json())
  .then(data => {
    allData = data.results[0].members;

    const allDataStates = allData.map(dataState => {
      return dataState.state;
    })
    const filterData = new Set(allDataStates);
    var filterResData = [...filterData];

    // appendElements(tableElement, allData);
    // addFiltersMembers(docPartys, allData, tableElement);
    // drawStateByFilter(filterResData, stateItems,tableElement, allData);
    
    // createTableAttendance(allData, tableHousePartyNumbers);
    // mostEngagesMembers(allData, mostEngaged);
    // leastEngageMembers(allData, leastEngaged);
    // drawLeastPartyLoyalty(allData, leastLoyal);
    // drawMostPartyLoyalty(allData, mostLoyal);

  })
}
getData();