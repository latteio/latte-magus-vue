import {defineComponent, reactive, ref} from "vue";
import {ElCol, ElCollapseTransition, ElContainer, ElForm, ElFormItem, ElHeader, ElIcon, ElMain, ElRow} from "element-plus";
import {ArrowDown, ArrowRight, Refresh, Search} from "@element-plus/icons-vue";
import {baseProps} from "@/components/defineViewComponent";
import MagFormBar from "@/components/form/MagFormBar";
import MagFlexComponent from "@/components/basic/MagFlexComponent";
import MagButton from "@/components/basic/MagButton";
import MagLink from "@/components/basic/MagLink";
import Objects from "@/utils/Objects";

const MagForm = defineComponent({
  name: "MagForm",
  props: {
    ...baseProps,
    region: {type: String, required: false, default: () => "center"},
    header: {type: String, required: false, default: () => ""},
    labelWidth: {type: [String, Number], required: false, default: () => "auto"},
    columns: {type: Number, required: false, default: () => 4},
    columnSpace: {type: Number, required: false, default: () => 8},
    model: {type: Object, required: false, default: () => new Object()},
    useQuery: {type: Boolean, required: false, default: () => false},
    expandQuery: {type: Boolean, required: false, default: () => false}
  },
  emits: ["query", "reset"],
  setup(props, {attrs, slots, emit, expose}) {
    const componentVisible = ref(props.visible);
    const componentExpanded = ref(props.expanded);
    const formRef = ref();
    const formModelCached = reactive({...props.model});
    const expandQuery = ref(props.expandQuery);
    const minHeight = ref(2 * 50);

    /**
     * 定义表单校验
     * @param successCallBack 成功回调函数
     * @param failureCallBack 失败回调函数
     */
    const validateForm = (successCallBack: Function, failureCallBack: Function) => {
      formRef.value.validate((isValid: boolean) => {
        if (isValid) {
          successCallBack && successCallBack(props.model || {});
        } else {
          failureCallBack && failureCallBack({});
        }
      });
    }

    /**
     * 定义重置表单字段: 清空验证信息
     */
    const resetForm = () => {
      formRef.value.resetFields();
      Objects.setObjectValues(props.model, formModelCached, true);
    }

    /**
     * 定义获取表单数据
     */
    const getFormData = () => {
      return props.model || {};
    }

    /**
     * 更新表单数据(包含缓存数据)
     */
    const updateFormData = (data: any) => {
      Objects.setObjectValues(props.model, data, true);
      Objects.setObjectValues(formModelCached, data, true);
    }

    /**
     * 设置组件可见性
     * @param visible
     */
    const setVisible = (visible: boolean) => {
      componentVisible.value = visible;
    }

    /**
     * 设置组件展开 / 收缩
     */
    const setExpandedInternal = () => {
      setExpanded(!componentExpanded.value);
    }
    const setExpanded = (paramExpanded: boolean) => {
      componentExpanded.value = paramExpanded;
    }

    /**
     * 定义组件外部方法
     */
    expose({
      setVisible,
      setExpanded,
      validateForm,
      resetForm,
      updateFormData,
      getFormData
    });

    /**
     * 定义 查询 按钮事件
     */
    const handleQuery = (event: any) => {
      emit("query", event, props.model);
    }

    /**
     * 定义 重置 按钮事件
     */
    const handleReset = (event: any) => {
      formRef.value.resetFields();
      Objects.setObjectValues(props.model, formModelCached, true);
      emit("reset", event, {});
    }

    /**
     * 定义 展开/收起 按钮事件
     */
    const handleExpandQuery = () => {
      expandQuery.value = !expandQuery.value;
    }

    /**
     * 定义表单头部
     */
    const formHeader = () => {
      if (props.header) {
        return <ElHeader class="mag-form__header" onclick={setExpandedInternal}>
          <div class="mag-form__header-text">{props.header}</div>
          <div class="mag-form__header-icon">
            {
              componentExpanded.value
                  ? (<ElIcon class="is-expanded"><ArrowRight/></ElIcon>)
                  : (<ElIcon><ArrowRight/></ElIcon>)
            }
          </div>
        </ElHeader>
      } else {
        return <ElHeader class="mag-form__header-empty">
        </ElHeader>
      }
    }

    /**
     * 定义底部按钮组
     */
    const createBottomBarNodes = (formBar: any) => {
      return <ElRow gutter={props.columnSpace}>
        <ElCol span={24}>
          <MagFormBar {...formBar?.props} {...formBar?.attrs} style={'margin-bottom: 8px;'}>
            {formBar?.children?.default?.()}
          </MagFormBar>
        </ElCol>
      </ElRow>
    }

    /**
     * 定义查询/重置/展开按钮组
     */
    const createQueryBtnNodes = () => {
      return <div style="display: flex; flex-direction: row;">
        <MagButton type="primary" icon={Search} onClick={handleQuery}>查询</MagButton>
        <MagButton style="margin-left: 4px;" icon={Refresh}
                   onClick={handleReset}>重置</MagButton>
        <MagLink type="primary" style="margin-left: 4px;" onClick={handleExpandQuery}>
          {expandQuery.value
              ? (<>
                    <ElIcon class="is-reversed">
                      <ArrowDown/>
                    </ElIcon>
                    <span style="margin-left: 4px;">收起</span>
                  </>
              )
              : (<>
                    <ElIcon>
                      <ArrowDown/>
                    </ElIcon>
                    <span style="margin-left: 4px;">展开</span>
                  </>
              )}
        </MagLink>
      </div>
    }

    /**
     * 表单组件布局: 列
     * @param cols
     */
    const createColumns = (cols: any) => {
      return <ElCol span={cols.span}>
        {
          cols.childNodes[0].props?.label
              ? (
                  <ElFormItem label-width={props.labelWidth}
                              label={cols.childNodes[0].props?.label}
                              prop={cols.childNodes[0].props?.prop}>
                    {cols.childNodes}
                  </ElFormItem>
              )
              : (
                  <MagFlexComponent class={`el-form-item el-form-item--${props.size}`}
                                    {...cols.childNodes[0].props}
                                    {...cols.childNodes[0].attrs}>
                    {cols.childNodes}
                  </MagFlexComponent>
              )
        }
      </ElCol>
    }

    /**
     * 表单组件布局: 行布局
     */
    const createRows = () => {
      let childNodes: any = [];
      if (props.useQuery) {
        if (expandQuery.value) {
          childNodes = [...slots?.default?.() || []];
        } else {
          let cnt = 0;
          const nodes = slots?.default?.() || [];
          for (let node of nodes) {
            if (cnt < props.columns - 1) {
              childNodes.push(node);
              cnt++;
            } else break;
          }
        }
        childNodes.push(createQueryBtnNodes());
      } else {
        childNodes = [...slots?.default?.() || []];
      }

      let formBar: any = null;
      let columnSpan = 24 / props.columns;
      let rowsJson: any = [], i = 0;
      if (childNodes.length > 0) {
        rowsJson[i] = {cols: []};
        let columnCount = props.columns;
        for (let childNode of childNodes) {
          if (typeof (childNode.type) === 'symbol') continue;
          if (childNode.type?.name === MagFormBar.name) {
            formBar = childNode;
            continue;
          }

          let spanCount: number = Math.min(childNode?.props?.span || 1, props.columns);
          if (spanCount == -1) {
            let rowCols = rowsJson[i]["cols"];
            let lastCol: any = rowCols.length > 0
                ? rowCols[rowCols.length - 1]
                : {span: columnSpan, childNodes: []};
            lastCol.childNodes.push(childNode);
          } else if (columnCount >= spanCount) {
            rowsJson[i]["cols"].push({span: columnSpan * spanCount, childNodes: [childNode]});
            columnCount -= spanCount;
          } else {
            rowsJson[++i] = {cols: []};
            columnCount = props.columns;
            if (columnCount >= spanCount) {
              rowsJson[i]["cols"].push({span: columnSpan * spanCount, childNodes: [childNode]});
              columnCount -= spanCount;
            }
          }
        }
      }

      if (rowsJson.length >= 1) {
        /* 普通表单 */
        if (!props.useQuery) {
          return <>
            {formBar
                && (!formBar.props?.position || formBar.props?.position === "top")
                && createBottomBarNodes(formBar)}

            {rowsJson.map((row: any) => {
              return <ElRow gutter={props.columnSpace}>
                {row.cols.map((cols: any) => {
                  return createColumns(cols)
                })}
              </ElRow>
            })}

            {formBar
                && (formBar.props?.position && formBar.props?.position === "bottom")
                && createBottomBarNodes(formBar)}
          </>
        }

        /* 查询表单: 启用查询 */
        return <>
          {formBar
              && (!formBar.props?.position || formBar.props?.position === "top")
              && createBottomBarNodes(formBar)}

          <ElRow gutter={props.columnSpace}>
            {rowsJson[0].cols.map((cols: any) => {
              return createColumns(cols)
            })}
          </ElRow>
          <ElCollapseTransition>
            <div v-show={expandQuery.value}>
              {rowsJson.slice(1, rowsJson.length).map((row: any) => {
                return <ElRow gutter={props.columnSpace}>
                  {row.cols.map((cols: any) => {
                    return createColumns(cols)
                  })}
                </ElRow>
              })}
            </div>
          </ElCollapseTransition>

          {formBar
              && (formBar.props?.position && formBar.props?.position === "bottom")
              && createBottomBarNodes(formBar)}
        </>
      }

      return <></>
    }

    /**
     * 定义返回模板
     */
    return () => {
      return <ElContainer v-show={componentVisible.value} class={props.shadow ? "mag-view-card-layout is-shadow-layout" : ""}>
        {formHeader()}
        <ElCollapseTransition>
          <ElMain class="mag-form__main" style={`height: ${minHeight}px;`} v-show={componentExpanded.value}>
            <ElForm {...props} {...attrs} ref={formRef}>
              {createRows()}
            </ElForm>
          </ElMain>
        </ElCollapseTransition>
      </ElContainer>
    }
  }
});

export default MagForm;
