<template>

<div>
<v-btn
  v-on:click="submitAnnotations"
  :disabled="disabledSubmit"
  v-if="newState"
>
  Submit New
</v-btn>
<v-btn
  v-on:click="submitAnnotations"
  :disabled="disabledSubmit"
  v-if="updateState"
>
  Submit Update
</v-btn>
<v-row>
    <v-col
      cols="12"
      sm="2"
    >
      <v-sheet
        rounded="lg"
        outlined
      >
        <taskOverview
        :taskDescription="$store.state.currentTask.text"
        :params="task.params"
        ></taskOverview>
        <!-- DEPRECATED <FileExplorer
          @set-main-content="setMainContent"
        /> -->
      </v-sheet>
    </v-col>
    <v-col
          cols="12"
          sm="8"
    >
      <v-sheet
        rounded="lg"
        min-height="268"
        outlined
      >
        <v-expansion-panels>
        <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate>Overall Document
          <template v-slot:actions>
            <v-icon>
              mdi-file-document-edit
            </v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
        <v-expansion-panels
          focusable
        >
          <v-expansion-panel>
            <v-expansion-panel-header>
              <template v-slot:default="{ open }">
                <v-row no-gutters>
                  <v-col cols="4">
                    Topic
                  </v-col>
                  <v-col
                    cols="8"
                    class="text--secondary"
                  >
                    <v-fade-transition leave-absolute>
                      <span
                        v-if="open"
                        key="0"
                      >
                        Enter a topic for the document
                      </span>
                      <span
                        v-else
                        key="1"
                      >
                        {{ document.topic }}
                      </span>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                v-model="document.topic"
                placeholder="IPhone X Review"
              ></v-text-field>
              <topicLabeler></topicLabeler>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
                  <v-expansion-panel-header>
              <template v-slot:default="{ open }">
                <v-row no-gutters>
                  <v-col cols="4">
                    Sentiment
                  </v-col>
                  <v-col
                    cols="8"
                    class="text--secondary"
                  >
                    <v-fade-transition leave-absolute>
                      <span
                        v-if="open"
                        key="0"
                      >
                        Enter a sentiment for the document
                      </span>
                      <span
                        v-else
                        key="1"
                      >
                        {{ sentimentLabel() }}
                      </span>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-radio-group
                v-model="document.sentiment"
                :mandatory="false"
                row
              >
                <v-radio
                  label='Extremely negative'
                  color='red darken-4'
                  value='extreme-neg-radio'
                ></v-radio>
                <v-radio
                  label='Very negative'
                  color='red darken-2'
                  value='very-neg-radio'
                ></v-radio>
                <v-radio
                  label='Negative'
                  color='red'
                  value='neg-radio'
                ></v-radio>
                <v-radio
                  label='Neutral'
                  color='grey'
                  value='neutral-radio'
                ></v-radio>
                <v-radio
                  label='Positive'
                  color='green'
                  value='pos-radio'
                ></v-radio>
                <v-radio
                  label='Very positive'
                  color='green darken-2'
                  value='very-pos-radio'
                ></v-radio>
                <v-radio
                  label='Extremely negative'
                  color='green darken-4'
                  value='extreme-pos-radio'
                ></v-radio>
              </v-radio-group>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
                  <v-expansion-panel-header>
              <template v-slot:default="{ open }">
                <v-row no-gutters>
                  <v-col cols="4">
                    Emotion
                  </v-col>
                  <v-col
                    cols="8"
                    class="text--secondary"
                  >
                    <v-fade-transition leave-absolute>
                      <span
                        v-if="open"
                        key="0"
                      >
                        Enter an emotion for the document
                      </span>
                      <span
                        v-else
                        key="1"
                      >
                        {{ document.emotion }}
                      </span>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                v-model="document.emotion"
                placeholder="Happiness"
              ></v-text-field>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <reactiveText
        ref="reactiveText"
        :text="document.text"
        @selected-text="onTextSelection"
        class="pa-6"
      >
      </reactiveText>

      <v-text-field
        id="text"
        ref="annotation"
        solo
        placeholder="Write your custom Entity"
        v-model="annotation.value"
        :rules="rules.annotation"
        prepend-inner-icon="mdi-plus-box-outline"
        @click:prepend-inner="doCreateEntity"
        @keydown.enter="doCreateEntity"
        class="px-4"
      ></v-text-field>

      </v-sheet>
    </v-col>
    <v-col
      cols="12"
      sm="2"
    >
      <sideAnnotationMenu
        :annotations="annotations"
        @edit-annotation="onEditAnnotation"
      >
      </sideAnnotationMenu>
    </v-col>
</v-row>

  <annotationMenu
      :selectedText="annotation.value"
      :dialog="menuStatus"
      :params="task.params"
      @updateDialog="update"
      @doSaveAnnotation="addAnnotation"
  >
  </annotationMenu>

</div>
</template>

<script>
import TopicLabelerSubComponent from '@/components/tabs/annotate/topicLabeler.vue';
import AnnotationMenuComponent from '@/components/tabs/annotate/annotationMenu.vue';
import SideAnnotationMenuComponent from '@/components/tabs/annotate/sideAnnotationMenu.vue';
import TaskOverviewComponent from '@/components/tabs/annotate/taskOverview.vue';
import annotateFormatters from '@/components/formatter/annotateFormatters';
import ReactiveText from '@/components/tabs/annotate/reactiveText.vue';
// import fsManager from '@/utils/FileSystemManager';
import annotateModel from '@/models/AnnotateModel';
import taskApi from '@/api/TaskApi';
import annotateApi from '@/api/AnnotateApi';
import enums from '@/utils/enums';

export default {
  name: 'AnnotateComponent',
  components: {
    topicLabeler: TopicLabelerSubComponent,
    annotationMenu: AnnotationMenuComponent,
    sideAnnotationMenu: SideAnnotationMenuComponent,
    reactiveText: ReactiveText,
    taskOverview: TaskOverviewComponent,
  },
  data: annotateModel,
  methods: {
    setMainContent(text) {
      this.document.text = text;
    },
    sentimentLabel() {
      return annotateFormatters.getSentimentLabel(this.document.sentiment);
    },
    onTextSelection({
      value,
      startPosition,
      endPosition,
    }) {
      if (value !== '') {
        this.annotation.value = value;
        this.annotation.startPosition = startPosition;
        this.annotation.endPosition = endPosition;
        this.menuStatus = true;
        // this.doCreateEntity();
      }
    },
    onEditAnnotation({
      entity,
      startPosition,
      endPosition,
    }) {
      this.annotations = this.annotations.filter((annotation) => annotation.entity !== entity);
      if (entity !== '') {
        this.annotation.value = entity;
        this.annotation.startPosition = startPosition;
        this.annotation.endPosition = endPosition;
        this.menuStatus = true;
      }
    },
    submitAnnotations() {
      const store = this.$store;
      const { user } = this.$auth;

      const annotations = {
        userId: user.sub,
        userName: user.name,
        userEmail: user.email,
        taskId: store.state.currentTask.id,
        taskText: store.state.currentTask.text,
        annotationProperties: this.annotations.map((a) => ({
          entity: a.entity,
          startPosition: a.startPosition,
          endPosition: a.endPosition,
          labels: a.labels,
        })),
      };

      try {
        switch (store.state.annotationState) {
          case enums.annotationState.NEW:
            annotateApi.createAnnotation(
              () => {
                this.throwSuccess('Annotations submitted successfully!');
              },
              annotations,
              (error) => {
                this.throwError(`Could not create annotation! Reason: ${error}`);
              },
            );
            break;
          case enums.annotationState.UPDATE:
            annotateApi.updateAnnotation(
              () => {
                this.throwSuccess('Annotations submitted successfully!');
              },
              store.state.annotationId,
              { annotationProperties: annotations.annotationProperties },
              (error) => {
                this.throwError(`Could not create annotation! Reason: ${error}`);
              },
            );
            break;
          default:
            break;
        }
      } catch (e) {
        this.throwError('This is us, not you!');
      } finally {
        this.retreiveInitialState();
      }
    },
    addAnnotation(annotationProperties) {
      this.annotations.push({
        entity: this.annotation.value,
        startPosition: this.annotation.startPosition,
        endPosition: this.annotation.endPosition,
        labels: annotationProperties.labels,
      });

      // persist annotations somehow
      // #DEPRECATED
      // write to a .json file with the same name as opened one
      // fsManager.writeToFile(fsManager.getAnnotationFile(), false, JSON.stringify({
      //   annotations: this.annotations,
      // }));

      // reset selection to default
      this.resetDefaultAnnotation();

      // color effect on already annotated parts
      this.$refs.reactiveText.tagValues(this.annotations);
    },
    doCreateEntity() {
      if (this.$refs.annotation.validate()) this.menuStatus = true;
    },
    update(value) {
      this.menuStatus = value;
    },
    alert() {
      this.alert();
    },
    retreiveInitialState() {
      this.$store.commit('resetDefaultTask');
      this.resetAnnotationsContent();
      this.resetDocumentOverview();
      this.resetTaskParams();
    },
    throwError(message) {
      const store = this.$store;
      store.commit('setError', message);
      store.dispatch('resetError');
    },
    throwSuccess(message) {
      const store = this.$store;
      store.commit('setSuccess', message);
      store.dispatch('resetSuccess');
    },
  },
  computed: {
    disabledSubmit() {
      return !(this.$store.state.currentTask.id && this.annotations.length);
    },
    newState() {
      return this.$store.state.annotationState === enums.annotationState.NEW;
    },
    updateState() {
      return this.$store.state.annotationState === enums.annotationState.UPDATE;
    },
  },
  created() {
    const that = this;
    const { state } = this.$store;

    if (state.currentTask.id) {
      taskApi.taskParams(state.currentTask.id, (result) => {
        that.$store.commit('setError', undefined);
        that.document.text = result.values.parameters.text;
        that.task.params.labels = result.values.parameters.labels;
        console.log(result);
      });
    } else {
      this.$store.commit('setError', 'Please choose a task first!');
    }

    switch (state.annotationState) {
      case enums.annotationState.NEW:
      // no current annotations
        break;
      case enums.annotationState.UPDATE:
        annotateApi.getAnnotation((result) => {
          this.annotations = result.annotationProperties;
        }, state.annotationId);
        break;
      default:
      // no default bihaviour yet
        break;
    }
  },
};

</script>
