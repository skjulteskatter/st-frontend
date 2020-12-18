import Vuex from 'vuex'
import api from '@/services/api'

const store = new Vuex.Store({
    getters: {
        currentUser (state) {
            return state.currentUser
        }
    },
    actions: {
        async startSession () {
            if (!api.session.isAuthenticated) {
                await api.session.login()
            }
            this.commit('setCurrentUser', await api.session.getCurrentUser())

            console.log(this.state.currentUser)
        }
    },
    mutations: {
        setCurrentUser (state, user) {
            state.currentUser = user
        }
    },
    state: {
        currentUser: {}
    }
})

export default store
