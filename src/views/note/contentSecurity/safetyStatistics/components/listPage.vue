<!-- <template>
  <div style="width: 50%; height: 300px;padding-left: 10%;">
    <span class="font-bold text-[18px] text-[#333]">用户</span>
    <div v-for="(item, index) in props.initialData.labels" :key="index">
      <div class="userList">
        <div class="userItem">
          <span :class="index + 1 <= 3 ? 'gold ' : 'ordinary'">{{ index + 1 }}</span>
          <span>{{ item }}</span>
        </div>

        <span>{{ initialData.values[index] }}</span>
      </div>
    </div>
  </div>
</template> -->
<template>
  <div class="user-list-wrapper" >
    <span class="font-bold text-[18px] text-[#333]">用户</span>

    <div
      v-for="(item, index) in props.initialData.labels"
      :key="index"
      class="user-card"
    >
      <div class="user-card__left">
        <span
          :class="[
            'user-card__rank',
            index < 3 ? 'user-card__rank--gold' : 'user-card__rank--ordinary'
          ]"
        >
          {{ index + 1 }}
        </span>
        <span class="user-card__name">{{ item }}</span>
      </div>

      <span class="user-card__score">{{ initialData.values[index] }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
// 图表数据接口
interface ChartData {
  labels: string[];
  values: number[];
}

// 组件Props定义
interface Props {
  initialData?: ChartData;
}

// 组件Props配置（带默认值）
const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({
    labels: [],
    values: [],
  }),
});

</script>
<!-- <style lang="scss" scoped>
.userList {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  .ordinary {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #d5d5d5;
    text-align: center;
  }

  .gold {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #FFF;
    background-color: #656460;
    text-align: center;
  }

}
</style> -->
<style lang="scss" scoped>
/* 整个榜单容器 */
.user-list-wrapper {
      width: 100%;
    max-width: 420px;
    margin: 0 auto;
    max-height: 300px;
    /* overflow: hidden; */
    overflow: auto;
}

/* 单条用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-top: 8px;
  border-radius: 8px;
  // background: #fff;
  // box-shadow: 0 2px 6px rgba(#000, .05);
  // transition: transform .2s, box-shadow .2s;

  // &:hover {
  //   transform: translateY(-2px);
  //   box-shadow: 0 4px 12px rgba(#000, .08);
  // }

  /* 左：序号 + 昵称 */
  &__left {
    display: flex;
    align-items: center;
    gap: 12px;              /* 序号与昵称间距 */
    min-width: 0;           /* 让省略号生效的关键 */
  }

  /* 序号圆点 */
  &__rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    line-height: 24px;
    flex-shrink: 0;         /* 防止被压缩 */

    &--gold {
      color: #fff;
      // background: linear-gradient(135deg, #ffce34, #ff9a00);
      // box-shadow: 0 2px 4px rgba(#ff9a00, .4);
       background-color: #656460;
    }

    &--ordinary {
      color: #666;
      background: #e6e6e6;
    }
  }

  /* 昵称 */
  &__name {
    font-size: 15px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 右：分值 */
  &__score {
    font-size: 16px;
    // font-weight: 600;
    // color: #fa5a5a;
    // flex-shrink: 0;
  }
}
</style>