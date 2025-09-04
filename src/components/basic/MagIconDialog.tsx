import {defineComponent, h, nextTick, PropType, reactive, ref, watch} from "vue";
import {ElDialog, ElFormItem, ElIcon, ElInput, ElScrollbar, ElTabPane, ElTabs, ElTag} from "element-plus";
import * as elIcons from "@element-plus/icons-vue";
import * as magIcons from "@/components/basic/MagIconComponents";
import MagButton from "@/components/basic/MagButton";
import {MagDialogModel} from "@/latte-magus-vue-types";
import Strings from "@/utils/Strings";

const MagIconDialog = defineComponent({
  name: "MagIconDialog",
  props: {
    model: {
      type: Object as PropType<MagDialogModel>,
      required: true,
      default: {
        visible: false,
        fullscreen: false,
        header: '',
        width: '60vw',
        height: '50vh',
        url: '',
        appendToBody: false,
        showConfirmBtn: true,
        showCancelBtn: true,
        data: {},
        onClose: () => {
        }
      }
    }
  },
  emits: ["update:visible", "dialogReady", "dialogConfirm", "dialogCancel"],
  setup(props, {attrs, emit, expose}) {
    const dialogVisible = ref(props.model.visible);

    const dialogFormModel = reactive({
      selectedText: ''
    });

    /**
     *  监听 props.model.visible 变化
     */
    watch(() => props.model.visible, (val) => {
      dialogVisible.value = val;
    });

    /**
     * 监听本地visible变化
     */
    watch(dialogVisible, (val) => {
      if (!val) {
        emit("update:visible", false);
      } else {
        nextTick(() => {
          emit("dialogReady", props.model.mode, props.model.data);
        }).then(() => {
        })
      }
    });

    /**
     * 定义对话框初始化方法
     */
    const onInitDialog = () => {
      props.model.visible = props.model.visible || false;
      props.model.fullscreen = props.model.fullscreen || false;
      props.model.header = props.model.header || "";
      props.model.width = props.model.fullscreen ? "100vw" : (props.model.width || "60vw");
      props.model.height = props.model.fullscreen ? "calc(100vh - 235px)" : (props.model.height || "40vh");
      props.model.url = props.model.url || ""
      props.model.appendToBody = props.model.appendToBody || false;
      props.model.showConfirmBtn = (props.model.showConfirmBtn !== false);
      props.model.showCancelBtn = (props.model.showCancelBtn !== false);
      dialogFormModel.selectedText = '';
    }

    /**
     * 定义点击对话框确定按钮事件
     */
    const onDialogConfirm = (event: any) => {
      event && event.stopPropagation();
      emit("dialogConfirm", {icon: dialogFormModel.selectedText});
    };

    /**
     * 定义点击对话框取消按钮事件
     */
    const onDialogCancel = (event: any) => {
      event && event.stopPropagation();
      emit("dialogCancel", {icon: ''});
    };

    /**
     * 定义关闭事件
     * @param retValues
     */
    const onCloseDialog = (retValues: any) => {
      props.model.visible = false;
      props.model.header = "";
      props.model.data = {};
      props.model.onClose && props.model.onClose(retValues);
    };

    expose({
      closeDialog: onCloseDialog
    });

    /**
     * 图标收集
     */
    const defaultIcons = Object.entries(elIcons);
    const extendsIcons = Object.entries(magIcons);

    /**
     * 选择图标
     */
    const selectIcon = (prefix: string, icon: any) => {
      let iconName: string = Strings.camelToMinus(icon.name);
      dialogFormModel.selectedText = prefix + iconName;
    }

    /**
     * 定义返回模板
     */
    return () => {
      onInitDialog();
      return <ElDialog
          {...props}
          {...attrs}
          modelValue={dialogVisible.value}
          onUpdate:modelValue={(val: boolean) => dialogVisible.value = val}
          title="选择图标"
          width={props.model.width}
          fullscreen={props.model.fullscreen}
          appendToBody={props.model.appendToBody}
          closeOnClickModal={false}
          closeOnPressEscape={false}
          alignCenter
          draggable
          show-close={false}
          v-slots={{
            footer: () => {
              return (props.model.showConfirmBtn || props.model.showCancelBtn)
                  ? (
                      <div class="mag-dialog__footer">
                        {props.model.showCancelBtn && (<MagButton onClick={onDialogCancel}>取消</MagButton>)}
                        {props.model.showConfirmBtn && (<MagButton onClick={onDialogConfirm} type="primary">确定</MagButton>)}
                      </div>
                  ) : null
            }
          }}>

        <ElFormItem prop="selectedText" label="当前选择图标: ">
          <ElInput prefix-icon={dialogFormModel.selectedText}
                   v-model={dialogFormModel.selectedText}
                   size="default"
                   clearable/>
        </ElFormItem>

        <ElTabs>
          <ElTabPane layzy v-slots={{
            label: () => {
              return <>
                <span>默认</span>
                <ElTag size="small" type="info">{defaultIcons.length}</ElTag>
              </>
            }
          }}>
            <ElScrollbar max-height="100vh" style={`height: ${props.model.height};`}>
              <div class="mag-select-icon__list">
                <ul>
                  {
                    defaultIcons.map(([iconName, iconComponent]) => {
                      return <li onClick={() => selectIcon('el-icon-', iconComponent)}>
                        <span data-icon={iconName}></span>
                        <ElIcon>
                          {h(iconComponent)}
                        </ElIcon>
                      </li>
                    })
                  }
                </ul>
              </div>
            </ElScrollbar>
          </ElTabPane>
          <ElTabPane layzy v-slots={{
            label: () => {
              return <>
                <span>扩展</span>
                <ElTag size="small" type="info">{extendsIcons.length}</ElTag>
              </>
            }
          }}>
            <ElScrollbar max-height="100vh" style={`height: ${props.model.height};`}>
              <div class="mag-select-icon__list">
                <ul>
                  {
                    extendsIcons.map(([iconName, iconComponent]) => {
                      return <li onClick={() => selectIcon('', iconComponent)}>
                        <span data-icon={iconName}></span>
                        <ElIcon>
                          {h(iconComponent)}
                        </ElIcon>
                      </li>
                    })
                  }
                </ul>
              </div>
            </ElScrollbar>
          </ElTabPane>
        </ElTabs>
      </ElDialog>
    }
  }
});

export default MagIconDialog;
