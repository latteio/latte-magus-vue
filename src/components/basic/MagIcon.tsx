import {defineAsyncComponent, defineComponent, h, PropType} from "vue";
import {ElIcon} from "element-plus";

const MagIcon = defineComponent({
  name: "MagIcon",
  props: {
    name: {type: [String, Object], required: true, default: () => ""},
    color: {type: String, required: false, default: () => ""},
    size: {type: Number, required: false, default: () => 14},
    dataScope: {type: Object, required: false, default: () => new Object()},
    visibleHandler: {type: Function as PropType<(scope: any) => boolean>, required: false, default: () => true}
  },
  setup(props, {attrs}) {
    if (!props.name) {
      throw 'No icon name or object is configured';
    }

    let iconComponent = typeof (props.name) === 'string'
        ? defineAsyncComponent(() => import(`@/components/basic/icons/MagIcon${props.name}.vue`))
        : props.name

    return () => h(ElIcon, {...props, attrs}, () => h(iconComponent));
  }
});

export default MagIcon;