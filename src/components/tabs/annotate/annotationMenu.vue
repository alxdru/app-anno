<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Annotation Menu</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-col>
              <v-textarea
                solo
                auto-grow
                readonly
                :value="selectedText"
              >
              </v-textarea>
              <v-row>
                <v-combobox
                  v-if="params.labels"
                  v-model="labelModel"
                  :items="params.labels.map((l) => l.display_name)"
                  :search-input.sync="search"
                  hide-selected
                  hint="Maximum of 1 entity type"
                  label="Define entity type"
                  multiple
                  persistent-hint
                  small-chips
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No labels matching "<strong>{{ search }}</strong>".
                           Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
                <v-spacer></v-spacer>
                <!-- <v-radio-group
                  label="Define event type"
                  :mandatory="false"
                >
                  <div><strong><h4>Life</h4></strong></div>
                  <v-radio
                    label="Be born"
                    value="radio-1"
                  ></v-radio>
                  <v-radio
                    label="Marry"
                    value="radio-2"
                  ></v-radio>
                  <v-radio
                    label="Die"
                    value="radio-3"
                  ></v-radio>
                  <div><strong><h4>Transaction</h4></strong></div>
                  <v-radio
                    label="Transfer ownership"
                    value="radio-4"
                  ></v-radio>
                  <v-radio
                    label="Transfer money"
                    value="radio-5"
                  ></v-radio>
                </v-radio-group> -->
              </v-row>
            </v-col>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="switchOffDialog()"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveAnnotation()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'AnnotationMenu',
  props: ['dialog', 'selectedText', 'params'],
  data: () => ({
    labelModel: [],
    search: null,
  }),
  methods: {
    switchOffDialog() {
      this.$emit('updateDialog', false);
    },
    saveAnnotation() {
      this.switchOffDialog();
      /**
       * Save annotation in the database
       * For now we emit an event to the parent
       *
       */
      const annotationProperties = {
        labels: this.labelModel,
      };

      this.$emit('doSaveAnnotation', annotationProperties);
    },
  },
  watch: {
    labelModel(val) {
      if (val.length > 1) {
        this.$nextTick(() => this.labelModel.pop());
      }
    },
  },
};
</script>
