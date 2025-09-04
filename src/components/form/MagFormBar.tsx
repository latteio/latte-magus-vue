import {defineComponent, h} from "vue";

const MagFormBar = defineComponent({
  name: "MagFormBar",
  props: {
    position: {type: String, required: false, default: () => "top"},
    align: {type: String, required: false, default: () => "left"}
  },
  setup(props, {attrs, slots}) {
    const aligns: any = {
      left: 'flex-start;',
      right: 'flex-end;',
      center: 'center;'
    }

    /**
     * 定义返回模板
     */
    return () => {
      let childBars: any = slots?.default?.();
      return <div {...props} {...attrs}
                  class="mag-button-group"
                  style={props.align && aligns[props.align] ? `justify-content: ${aligns[props.align]}` : ""}>
        {childBars.map((bar: any) => h(bar, {formType: false}))}
      </div>
    }
  }
});

export default MagFormBar;
