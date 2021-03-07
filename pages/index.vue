<template>
  <div class="container">
    <div ref="form" class="form">
      <div class="searchWrapper">
        <label>
          <input v-model.trim="keyword" class="search" />
        </label>
      </div>
      <div class="content">
        <p v-if="$fetchState.pending">Fetching users...</p>
        <p v-else-if="$fetchState.error">Something went wrong :(</p>
        <template v-else>
          <template v-if="filteredUsers.length > 0">
            <template v-for="user of scrolledUsers">
              <UserCard :key="user.id" :user="user" :keyword="keyword" />
            </template>
          </template>
          <div v-else>No users found</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash-es/debounce';
import memoize from 'lodash-es/memoize';
import reduce from 'lodash-es/reduce';
import shortid from 'shortid';
import UserCard from '~/components/UserCard';

const USERS_URL =
  'https://gist.githubusercontent.com/allaud/093aa499998b7843bb10b44ea6ea02dc/raw/c400744999bf4b308f67807729a6635ced0c8644/users.json';
const SCROLL_USERS_OFFSET = 50;
const SEARCH_DELAY = 1000;

export default {
  components: { UserCard },

  asyncData({ params }) {
    let keyword = '';

    if (params.keyword) {
      keyword = params.keyword;
    }

    return { keyword };
  },

  data() {
    return {
      users: [],
      flattenUsers: [],
      filteredUsers: [],
      scrolledUsers: [],
      keyword: '',
    };
  },

  async fetch() {
    let usersData = [];
    try {
      usersData = await fetch(USERS_URL).then((res) => res.json());
    } catch (err) {
      console.error(err);
    }

    usersData.forEach((user) => {
      this.flattenUsers.push(
        reduce(
          user,
          (result, value, key) => {
            if (key !== 'avatar') {
              result += ` ${value.toLowerCase()}`;
            }

            return result;
          },
          '',
        ),
      );
      this.users.push({ ...user, id: shortid.generate() });
    });

    await this.filterUsers(this.formattedKeyword);
  },

  computed: {
    formattedKeyword() {
      return this.keyword ? this.keyword.toLowerCase().trim() : '';
    },
  },

  watch: {
    async keyword() {
      await this.filterUsers(this.formattedKeyword);
    },

    filteredUsers() {
      this.$refs.form.scrollTop = 0;
      this.scrolledUsers = this.filteredUsers.slice(0, SCROLL_USERS_OFFSET);
    },
  },

  created() {
    this.scrolledUsers = this.filteredUsers.slice(0, SCROLL_USERS_OFFSET);
    const memoizedSearch = memoize(this.search);
    this.debouncedSearch = debounce((key, resolve) => {
      this.filteredUsers = memoizedSearch(key);
      resolve();
    }, SEARCH_DELAY);
  },

  mounted() {
    this.setScrollHandler();
  },

  methods: {
    search(searchKeyword) {
      return this.flattenUsers.reduce((result, currentVal, index) => {
        if (currentVal.includes(searchKeyword)) {
          result.push({ ...this.users[index] });
        }

        return result;
      }, []);
    },

    filterUsers(keyword) {
      return new Promise((resolve) => {
        if (!keyword) {
          this.filteredUsers = this.users;
          this.debouncedSearch.cancel();
          resolve();
        } else {
          this.debouncedSearch(keyword, resolve);
        }
      });
    },

    updateScrolledUsers() {
      const bottomOfForm = this.$refs.form.scrollTop + this.$refs.form.offsetHeight >= this.$refs.form.scrollHeight;

      if (bottomOfForm) {
        const scrolledUsersLength = this.scrolledUsers.length;
        const filteredUsersToInsert = this.filteredUsers.slice(
          scrolledUsersLength,
          scrolledUsersLength + SCROLL_USERS_OFFSET,
        );
        this.scrolledUsers = [...this.scrolledUsers, ...filteredUsersToInsert];
      }
    },

    setScrollHandler() {
      this.$refs.form.onscroll = this.updateScrolledUsers;
    },
  },
};
</script>

<style>
.container {
  height: 100vh;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  min-width: 690px;
  max-width: 690px;
  min-height: 644px;
  max-height: 644px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow-y: overlay;
}

.content {
  padding: 0 28px 20px 12px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.form::-webkit-scrollbar {
  width: 6px;
}

.form::-webkit-scrollbar-thumb {
  background-color: grey;
  border-radius: 6px;
}

.searchWrapper {
  position: sticky;
  top: -1px;
  padding: 20px 28px 20px 12px;
  background-color: #fff;
}

.search {
  width: 100%;
  min-height: 48px;
  background-color: #fafafa;
  background-image: url(~assets/icons/search.svg);
  background-repeat: no-repeat;
  background-position: 20px center;
  background-size: 18px 18px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  border: 1px solid;
  border-image-source: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 79.47%,
    rgba(0, 0, 0, 0.04) 99.34%
  );
  outline: none;
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.75);
  padding: 0 10px 0 50px;
}
</style>
