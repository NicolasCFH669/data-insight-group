Vue.createApp({
  data() {
    return {
      urlApi: 'https://api.propublica.org/congress/v1/113/house/members.json',
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
    }
  },

  created (){
    fetch(this.urlApi, this.init)
      .then(res => res.json())
      .then(data => {
      this.data = data.results[0].members;
      this.states = this.data.map(state => state.state).sort();
      this.uniqueStates = [... new Set(this.states)];
    });
  },

  methods: {
  },
  
  computed: {
    filterByParty() {
      this.byPartyData = []
      this.data.forEach(partyMember => {
        this.checked.length == 0 ? this.byPartyData = this.data : this.checked.forEach(check => partyMember.party == check ? this.byPartyData.push(partyMember) : check == 'ID'  ? this.byPartyData = this.data : '')
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
    }
  }
}).mount('#house')