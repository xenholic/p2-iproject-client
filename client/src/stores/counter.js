import axios from 'axios'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    isLogin: false,
    LoginForm: {
      email: "",
      password: "",
    },
    registerForm: {
      email: "",
      password: "",
      username: "",
      phoneNumber: "",
      address: ""
    },
    counter: 0,
    baseUrl: "http://localhost:4000",
    apiKey: "38f2cc376208d37fec1e1dbaa6c3ae29",
    trendingUrl: "https://api.themoviedb.org/3",
    moviesData: [],
    trendingMovies: [],
    topMovies: [],
    moviesDetail: {},
    prices: []
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    setLogin(status = false) {
      this.isLogin = status
    },

    async Register() {
      try {
        axios.post(`${this.baseUrl}/register`, {
          email: this.registerForm.email,
          password: this.registerForm.password,
          username: this.registerForm.username,
          phoneNumber: this.registerForm.phoneNumber,
          address: this.registerForm.address
        })
        Swal.fire({
          icon: "success",
          title: `Success`,
          text: `Success Register`,
        });
        this.$router.push('/login')
      } catch (err) {
        console.log(err, "ini error");
        Swal.fire({
          icon: "error",
          title: `Error`,
          text: `${err.response.data.message}`,
        });
      } finally {
        this.email = ''
        this.password = ''
        this.username = ''
        this.phoneNumber = ''
        this.address = ''
      }
    },

    async Login() {
      try {
        let custData = await axios.post(`${this.baseUrl}/login`, {
          email: this.LoginForm.email,
          password: this.LoginForm.password
        })
        console.log(custData, "ini data");
        localStorage.setItem("access_token", custData.data.access_token)
        localStorage.setItem("UserId", custData.data.id)
        localStorage.setItem("email", custData.data.email)
        localStorage.setItem("username", custData.data.username)

        Swal.fire({
          icon: 'success',
          title: 'Nice!',
          text: `${this.LoginForm.email}`,
        })
        this.isLogin = true
        this.$router.push('/')
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: err.response.data.message,
        })
      }
    },

    async getPopularMovies() {
      try {
        let response = await axios.get(`${this.baseUrl}/movies`)

        this.moviesData = response.data.results
      } catch (err) {
        console.log(err, "ini err");
      }
    },

    async getTrendingMovies() {
      try {
        let response = await axios.get(`${this.trendingUrl}/trending/movie/week?api_key=${this.apiKey}`)

        this.trendingMovies = response.data.results

      } catch (err) {
        console.log(err, "ini error");
      }
    },

    async getTopMovies() {
      try {
        let response = await axios.get(`${this.trendingUrl}/movie/top_rated?api_key=${this.apiKey}`)

        this.topMovies = response.data.results
      } catch (err) {
        console.log(err, "ini error top");
      }
    },

    async dataMovieDetail(movieId) {
      try {
        const response = await axios.get(`${this.baseUrl}/movies/${movieId}`, {
          headers: {
            access_token: localStorage.getItem("access_token"),
          },
        });
        console.log(response, "ini movie detail");
        this.moviesDetail = response.data.results
      } catch (err) {
        console.log(err, "ini error detail");
      }
    },

    async dataPrice() {
      try {
        const response = await axios.get(`${this.baseUrl}/prices`);
        this.price = response.data
      } catch (err) {
        console.log(err, "ini error price");
      }
    },

    async addTransaction(data) {
      try {
        await axios.post(
          `${this.baseUrl}/movies/${data.MovieId}`,
          {
            PriceId: data.PriceId,
          },
          {
            headers: {
              access_token: localStorage.getItem("access_token"),
            },
          }
        );
        // console.log(response.data, "=========");
      } catch (err) {
        console.log(err);
      }
    },
  }
})
