import {defineComponent, ref} from "vue";
import {ElTabs} from "element-plus";
import {baseProps} from "@/components/defineViewComponent";

const MagTabGroup = defineComponent({
  name: "MagTabGroup",
  props: {
    ...baseProps,
    type: {type: String, required: false, default: () => "border-card"},
    active: {type: String, required: true, default: () => "0"},
    stretch: {type: Boolean, required: false, default: () => false}
  },
  setup(props, {attrs, slots, expose}) {
    const componentVisible = ref(props.visible);
    const currentTab = ref(props.active);

    /**
     * 定义组件外部方法
     */
    expose({
      setVisible: (visible: boolean) => {
        componentVisible.value = visible;
      }
    });

    /**
     * 定义返回模板
     */
    return () => (
        <ElTabs v-show={componentVisible.value} {...props} {...attrs} v-model={currentTab.value}
                class={{"mag-view-card-layout is-shadow-layout": props.shadow}}>
          {slots?.default?.()}
        </ElTabs>
    )
  }
});

export default MagTabGroup;
