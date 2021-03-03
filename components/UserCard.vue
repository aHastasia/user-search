<template>
  <div class="userCard">
    <img :src="user.avatar" class="userAvatar" alt="avatar" @error="insertDefaultImage" />
    <div class="userCardContent">
      <div class="userData">
        <div class="userInfo">
          <p class="userName" :title="user.name" v-html="highlight(user.name)" />
          <p class="userEmail" :title="user.email" v-html="highlight(user.email)" />
        </div>
        <p class="userTitle" v-html="highlight(user.title)" />
        <p class="userAddress" v-html="highlight(`${user.address}, ${user.city}`)" />
      </div>
      <div :class="[{ border: isSkipped }, 'actionBlock']">
        <button class="actionButton" @click="setIsSkipped">{{ actionButtonLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      default: () => ({
        avatar: 'Unknown',
        name: 'Unknown',
        email: 'Unknown',
        title: 'Unknown',
        address: 'Unknown',
        city: 'Unknown',
        isSkipped: false,
      }),
    },
    keyword: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isSkipped: false,
    };
  },
  computed: {
    actionButtonLabel(user) {
      return user.isSkipped ? 'MARK AS SUITABLE' : 'SKIP SELECTION';
    },
  },
  methods: {
    insertDefaultImage(event) {
      event.target.src = require('~/assets/images/default-avatar.png');
    },

    setIsSkipped() {
      this.isSkipped = !this.isSkipped;
    },

    highlight(text) {
      // Use CSS modules instead
      return text.replace(new RegExp(this.keyword, 'gi'), '<span style="background-color: yellow">$&</span>');
    },
  },
};
</script>

<style scoped>
.userCard {
  height: 136px;
  display: flex;
  background: #fafafa;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.24);
  border-radius: 3px;
}

.userCard:not(:last-child) {
  margin-bottom: 22px;
}

.userAvatar {
  background-color: rgba(0, 0, 0, 0.25);
  width: 134px;
  height: 136px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.userCardContent {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.userData {
  padding: 10px 10px 4px 28px;
}

.userInfo {
  display: flex;
  justify-content: space-between;
}

.userName {
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.87);
  margin-right: 10px;
  max-width: 224px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.userTitle {
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.5438);
}

.userAddress {
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.5438);
}

.userEmail {
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.54);
  max-width: 252px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.border {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.actionBlock {
  padding: 14px 0 20px 32px;
}

.actionButton {
  border: none;
  text-decoration: none;
  background: none;
  cursor: pointer;
  outline: none;
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #009688;
}
</style>
