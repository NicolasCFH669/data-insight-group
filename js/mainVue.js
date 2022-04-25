Vue.createApp({
  data() {
    return {
      init: {
        method: 'GET',
        headers: {
          'X-API-Key': 'MyhXBFeR6PsmF1QpR3WNbxQFQxwhOIx8vmmzR66n'
        }
      },
      data: [],
      states: [],
      uniqueStates: [],
      checked: [],
      selectedState: '',
      byPartyData: [],
      numberOfReps: {
        democrats: [0, 0],
        republicans: [0, 0],
        independents: [0, 0],
        total: [0, 0]
      },
      notFoundData: 'Not found',
      arrOrdenado: [],
      arrLeastAtt: [],
      arrMostAtt: []
    }
  },

  created (){
    let chamber = document.getElementById('senate-data') ? 'senate' : 'house';
    let urlApi = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;
    fetch(urlApi, this.init)
      .then(res => res.json())
      .then(data => {
      this.data = data.results[0].members;
      this.states = this.data.map(state => state.state).sort();
      this.uniqueStates = [... new Set(this.states)];
      // console.log(this.data)
    });
  },

  methods: {
  },
  
  computed: {
    filterByParty() {
      this.byPartyData = []
      this.data.forEach(partyMember => {
        this.checked.length == 0 ? this.byPartyData = this.data : this.checked.forEach(check => partyMember.party == check ? this.byPartyData.push(partyMember) : '')
      });
    },

    filterByState() {
      this.byPartyData = []
      if(this.selectedState){
        this.data.forEach(stateMember => {
          if(this.selectedState == stateMember.state){
            this.byPartyData.push(stateMember);
          }
        })
      }
      if(this.selectedState == 'disabled'){
        this.byPartyData = this.data;
      }
    },

    drawTableReps() {
      this.numberOfReps = {
        democrats: [0, 0],
        republicans: [0, 0],
        independents: [0, 0],
        total: [0, 0]
      };
      this.data.forEach(member => {
        if(member.party == 'D'){
          this.numberOfReps.democrats[0] +=1;
          this.numberOfReps.democrats[1] += member.votes_with_party_pct
        }
        if(member.party == 'R'){
          this.numberOfReps.republicans[0] +=1;
          this.numberOfReps.republicans[1] += member.votes_with_party_pct;
        }
        if(member.party == 'ID'){
          this.numberOfReps.independents[0] +=1;
          this.numberOfReps.independents[1] += member.votes_with_party_pct;
        }
      })
      let total = this.numberOfReps.democrats[0] + this.numberOfReps.republicans[0] +this.numberOfReps.independents[0];
      let totalPct = (this.numberOfReps.democrats[1] + this.numberOfReps.republicans[1] +this.numberOfReps.independents[1]) / total;
      this.numberOfReps.total[0] = total;
      this.numberOfReps.total[1] = Math.round(totalPct)
    },

    drawLeastAttendance() {
      this.arrLeastAtt = []
      this.arrOrdenado = this.data.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct);
      let leastPct = Math.round(this.arrOrdenado.length * 0.1);
      for(let indice = 0; indice < leastPct; indice++){
        this.arrLeastAtt.push(this.arrOrdenado[indice])
      }
    },

    drawMostAttendance() {
      this.arrMostAtt = []
      this.arrOrdenado = this.data.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct);
      let mostPct = Math.round(this.arrOrdenado.length * 0.1);
      for(let indice = 0; indice < mostPct; indice++){
        this.arrMostAtt.push(this.arrOrdenado[indice])
      }
    },

    drawLeastLoyal() {
      this.arrLeastAtt = [];
      this.arrOrdenado = this.data.sort((a, b) => b.votes_against_party_pct - a.votes_against_party_pct);
      let leastPct = Math.round(this.arrOrdenado.length * 0.1);
      for(let indice = 0; indice < leastPct; indice ++){
        this.arrLeastAtt.push(this.arrOrdenado[indice])
      }
    },

    drawMostLoyal() {
      this.arrMostAtt = [];
      this.arrOrdenado = this.data.sort((a, b) => a.votes_against_party_pct - b.votes_against_party_pct);
      let mostPct = Math.round(this.arrOrdenado.length * 0.1);
      for(let indice = 0; indice < mostPct; indice++){
        this.arrMostAtt.push(this.arrOrdenado[indice])
      }
    }
  }
}).mount('#app')