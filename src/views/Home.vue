<template>
  <v-app class="home">
    <v-app-bar
      app
      color="white"
      elevate-on-scroll>

      <v-btn @click="logout" text color="gray" >Logout</v-btn>
      <v-divider></v-divider>
      <v-avatar
        class="hidden-sm-and-down"
        color="grey darken-1 shrink"
        size="54">
        <img
          :src="profilePicture"
          :alt="profileName">
      </v-avatar>
      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
          fixed-tabs
          color="green"
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab
            href="#tab-tasks"
            to="/tasks"
          >
            Tasks
          </v-tab>

          <v-tab
            href="#tab-annotate"
            to="/annotate"
          >
            Annotate
          </v-tab>

          <v-tab
            href="#tab-list-documents"
            to="/documents"
          >
            List Documents
          </v-tab>

          <v-tab
            href="#tab-statistics"
            to="/statistics"
          >
            Statistics
          </v-tab>

          <v-tab
            href="#tab-annotations"
            to="/annotations"
          >
            Annotations
          </v-tab>
        </v-tabs>
        </template>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  <v-footer padless app>
    <v-alert v-if="success !== undefined" type="success">
      {{ success }}
    </v-alert>
    <v-alert v-if="error !== undefined" type="error">
      {{ error }}
    </v-alert>
  </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    tabs: '',
    selectedTab: 'AnnotateTab',
    profilePicture: '',
    profileName: 'Anonymous',
  }),
  methods: {
    logout() {
      localStorage.removeItem('jwt');
      this.$auth.logout();
      // this.$router.push('/login');
    },
  },
  created() {
    const { $auth } = this;
    $auth.getProfileInfo(localStorage.getItem('jwt'), (err, authResult) => {
      $auth.user = authResult;
      this.profilePicture = authResult.picture ? authResult.picture : '';
      this.profileName = authResult.given_name ? authResult.given_name : 'Anonymous';
    });
  },
  computed: mapState([
    'success',
    'error',
  ]),
};
</script>
