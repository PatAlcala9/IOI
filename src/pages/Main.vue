<template>
  <q-page v-if="dark" padding class="page--dark">
    <!-- <div class="">
      <img src="..\statics\background-ling.jpg" width="400" height="600"/>>
    </div> -->
      <div class="grid-container">
        <input id="camera" type="file" accept="image/*" capture="camera" hidden/>
        <q-input dark class="searchbar" bg-color="black" color="white" rounded outlined v-model="appno" mask="##-########" label="Application Number" @keydown.enter="loadData">
          <template v-slot:append>
            <q-avatar>
              <q-icon v-if="appno === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="clearData_search" />
            </q-avatar>
          </template>
        </q-input>
      <transition appear enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">
      <q-btn v-if="appno !== ''" round unelevated class="searchcircle" color="primary" @click="loadData"><q-icon name="search"/></q-btn>
      </transition>
      <q-btn class="logout" unelevated rounded color="primary" label="Logout" @click="openImages"/>
    </div>
    <div><br/></div>
    <div class="details">
        <div class="ownername">
          <ilabel value="Owner Name :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="name" style="font-size: 20px;"></q-input>
        </div>

        <div class="address">
          <ilabel value="Address :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="address" style="font-size: 20px;"></q-input>
        </div>
        <div class="location">
          <ilabel value="Location of Application :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="location" style="font-size: 20px;"><q-btn v-if="appid > 0" flat color="primary" label="Locate" @click="showmap" /></q-input>
        </div>
        <div class="scope">
          <ilabel value="Scope of Work :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="scope" style="font-size: 20px;"></q-input>
        </div>
        <div class="typeoruse">
          <ilabel value="Type or Use :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="typeoruse" style="font-size: 20px;"></q-input>
        </div>
    </div>
    <div><br/><br/></div>

    <div class="typeofcon" v-if="appid > 0">
      <label>Type of Construction :</label><br />
      <q-btn-dropdown v-if="savedTypeBool" split unelevated color="white" text-color="black" @input="checkSavedDropdown">
        <template v-slot:label>
          <div class="row items-center no-wrap">
            <div class="text-center">{{selectedType}}</div>
          </div>
        </template>

        <q-list>
          <q-item clickable v-close-popup @click="setType('Type I')">
            <q-item-section>
              <q-item-label>Type I</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setType('Type II')">
            <q-item-section>
              <q-item-label>Type II</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setType('Type III-A')">
            <q-item-section>
              <q-item-label>Type III-A</q-item-label>
            </q-item-section>
          </q-item>

           <q-item clickable v-close-popup @click="setType('Type III-B')">
            <q-item-section>
              <q-item-label>Type III-B</q-item-label>
            </q-item-section>
          </q-item>

           <q-item clickable v-close-popup @click="setType('Type IV')">
            <q-item-section>
              <q-item-label>Type IV</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setType('Type V')">
            <q-item-section>
              <q-item-label>Type V</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn-dropdown v-else disable-dropdown split unelevated color="white" text-color="black">
        <template v-slot:label>
          <div class="row items-center no-wrap">
            <div class="text-center">{{selectedType}}</div>
          </div>
        </template>
      </q-btn-dropdown>
    </div>

    <div class="dtable" v-if="userdefaultaccess">
        <q-table class="datatable" title="Findings" :data="empdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom></q-table>
    </div>

    <div class="dtable" v-if="userbuildinglgaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Line and Grade" :data="bldglgdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" row-key="name" flat hide-bottom>
        <template v-slot:top v-if="appid > 0">
          <label style="color: black; font-size:1rem">Findings for Building Line and Grade</label>
          <q-space />
          <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildinglineandgrade = true" />
          <!-- <q-btn class="on-right mobilemode" flat dense color="orange-10" :disable="loading" label="Remove last" @click="removebuildinglineandgrade" /> -->
          <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildinglineandgrade" />
          <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldglgdata, 'LINE AND GRADE')" />
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building LG')">
            <q-td key="description" :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" title="Edit Data">
                <q-input v-model="props.row.name" dense autofocus />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldglgdata, 'LINE AND GRADE')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt" @click="gotoCamera"/>

        <q-dialog v-model="deleterowblg" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildinglineandgrade(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancylgaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Line and Grade" :data="occlgdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Line and Grade</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancylineandgrade = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancylineandgrade" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occlgdata, 'LINE AND GRADE')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy LG')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occlgdata, 'LINE AND GRADE')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowolg" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancylineandgrade(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingarchaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Architecture" :data="bldgarchdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Architecture</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingarchitecture = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingarchitecture" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgarchdata, 'ARCHITECTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Arch')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgarchdata, 'ARCHITECTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbar" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingarchitecture(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancyarchaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Architecture" :data="occarchdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Architecture</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancyarchitecture = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancyarchitecture" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occarchdata, 'ARCHITECTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Arch')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occarchdata, 'ARCHITECTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowoar" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancyarchitecture(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingstructaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Structural" :data="bldgstructdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Structural</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingstructural = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingstructural" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgstructdata, 'STRUCTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Struct')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgstructdata, 'STRUCTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbst" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingstructural(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancystructaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Structural" :data="occstructdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Structural</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancystructural = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancystructural" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occstructdata, 'STRUCTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Struct')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occstructdata, 'STRUCTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowost" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancystructural(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingplumaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Sanitary/Plumbing" :data="bldgplumdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Sanitary/Plumbing</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingplumbing = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingplumbing" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgplumdata, 'SANITARY/PLUMBING')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Plum')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgplumdata, 'SANITARY/PLUMBING')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbpl" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingplumbing(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancyplumaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Sanitary/Plumbing" :data="occplumdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Sanitary/Plumbing</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancyplumbing = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancyplumbing" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occplumdata, 'SANITARY/PLUMBING')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Plum')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occplumdata, 'SANITARY/PLUMBING')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowopl" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancyplumbing(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingelecaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Sanitary/Plumbing" :data="bldgelecdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Electrical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingelectrical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingelectrical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgelecdata, 'ELECTRICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Elec')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgelecdata, 'ELECTRICAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbel" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingelectrical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancyelecaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Sanitary/Plumbing" :data="occelecdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Electrical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancyelectrical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancyelec" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occelecdata, 'ELECTRICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Elec')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occelecdata, 'ELECTRICAL')" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowoel" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancyelectrical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingmechaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Sanitary/Plumbing" :data="bldgmechdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Mechanical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingmechanical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingmechanical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgmechdata, 'MECHANICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Mech')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgmechdata, 'MECHANICAL')" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowbme" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingmechanical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancymechaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Sanitary/Plumbing" :data="occmechdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Mechanical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancymechanical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancymech" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occmechdata, 'MECHANICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Mech')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occmechdata, 'MECHANICAL')" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowome" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancymechanical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="usersignageaccess">
      <br/>
      <q-table class="datatable" title="Findings for Signage" :data="signdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Signage</label>
            <q-space />
            <q-btn v-if="signageallowadd" flat dense color="secondary" :disable="loading" label="Add row" @click="addsignagerow = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallsignage" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveSignage2" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Signage')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveSignage2" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowsig" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removesignage(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="dtable" v-if="userelectricalaccess">
      <br/>
      <q-table class="datatable" title="Findings for Electrical" :data="elecdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Electrical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addelectrical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallelectrical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveElectrical2" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Electrical')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveElectrical2" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowele" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeelectrical(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="dtable" v-if="usermechanicalaccess">
      <br/>
      <q-table class="datatable" title="Findings for Mechanical" :data="mechdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Mechanical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addmechanical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallmechanical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveMechanical2" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Mechanical')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveMechanical2" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowmec" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removemechanical(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

     <div class="dtable" v-if="userzoningaccess">
      <br/>
      <q-table class="datatable" title="Findings for Land Use and Zoning" :data="zoningdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Land Use and Zoning</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addzoning = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallzoning" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save"/> <!-- @click="saveZoning" -->
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Zoning')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" /> <!-- @click="saveZoning" -->
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowzon" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removezoning(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

     <div class="dtable" v-if="userbfpaccess">
      <br/>
      <q-table class="datatable" title="Findings for Land Use and Zoning" :data="bfpdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Bureau of Fire</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbfp = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbfp" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save"/> <!-- @click="saveBFP" -->
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'BFP')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" /> <!-- @click="saveBFP" -->
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowbfp" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebfp(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- <q-dialog v-model="addrow">
      <q-card>
        <q-card-section dark style="background: #ffab40;">
          <div class="text-h6">Add Findings</div>
        </q-card-section>
        <q-carousel
          v-model="slide"
          transition-prev="scale"
          transition-next="scale"
          swipeable
          animated
          control-color="white"
          navigation
          padding
          arrows
          height="300px"
          class="bg-primary text-white shadow-1 rounded-borders"
        >
        <q-carousel-slide name="style" class="column no-wrap flex-center" style="background: #2979ff;">
          <label>Description</label>
          <q-input dark v-model="sdescription" :dense="dense" size="100px"/>
        </q-carousel-slide>
        <q-carousel-slide name="tv" class="column no-wrap flex-center wide">
          <label>Date Started</label>
          <q-input filled v-model="sdatestart" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="sdatestart" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-carousel-slide>
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <label>Date Ended</label>
          <q-input filled v-model="sdateend" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="sdateend" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-carousel-slide>
        </q-carousel>
        <q-card-section v-if="sdescription !== ''" style="background: #2979ff;">
          <q-btn unelevated class="dialogbutton" color="primary" label="Save" @click="addFinder"/>
        </q-card-section>
       </q-card>
    </q-dialog> -->
    <q-dialog v-model="addrow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined class="bg-white" v-model="sdescription" :dense="dense"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addFinder"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildinglineandgrade" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Line and Grade</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingLG"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingLG"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancylineandgrade" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Line and Grade</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyLG"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyLG"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingarchitecture" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Architecture</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingArch"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingArch"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancyarchitecture" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Architecture</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyArch"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyArch"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingstructural" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Structural</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingStruct"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingStruct"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancystructural" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Structural</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyStruct"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyStruct"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingplumbing" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Sanitary/Plumbing</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingPlum"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingPlum"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancyplumbing" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Sanitary/Plumbing</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyPlum"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyPlum"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingelectrical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Electrical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingElec"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingElec"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancyelectrical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Electrical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyElec"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyElec"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingmechanical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Mechanical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingMech"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingMech"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancymechanical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Mechanical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyMech"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyMech"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

     <q-dialog v-model="addsignagerow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Signage</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addSignage"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addSignage"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

     <q-dialog v-model="addelectrical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Electrical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addElectrical"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addElectrical"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

     <q-dialog v-model="addmechanical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Mechanical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addMechanical"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addMechanical"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addzoning" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Land Use and Zoning</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addZoning"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addZoning"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbfp" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Bureau of Fire</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBFP"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBFP"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <br/><br/>
    <!-- <div class="saveArea" v-if="appid > 0">
      <q-btn unelevated class="savebutton" color="primary" icon="check" label="Save" @click="saveData" />
    </div> -->
<!-- //v-model="maps"  -->
    <q-dialog v-model="map" :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down" style="opactity: 0.5">
      <q-card class="bg-primary text-white" style="opacity: 0.9">

        <q-card-section>
          <div class="text-h6">OCBO Map</div>
        </q-card-section>

       <!-- <q-card-section class="row justify-center">
          <mapa></mapa>
        </q-card-section>-->

        <q-card-section class="row justify-center">
          <q-btn unelevated class="mapbutton" color="positive" label="OK" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <q-page v-else padding class="page">
    <!-- <div class="">
      <img src="..\statics\background-ling.jpg" width="400" height="600"/>>
    </div> -->
      <div class="grid-container">
        <input id="camera" type="file" accept="image/*" capture="camera" hidden/>
        <q-input class="searchbar" bg-color="white" rounded outlined v-model="appno" mask="##-########" label="Application Number" @keydown.enter="loadData">
          <template v-slot:append>
            <q-avatar>
              <q-icon v-if="appno === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="clearData_search" />
            </q-avatar>
          </template>
        </q-input>
      <transition appear enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">
      <q-btn v-if="appno !== ''" round unelevated class="searchcircle" color="primary" @click="loadData"><q-icon name="search"/></q-btn>
      </transition>
      <q-btn class="logout" unelevated rounded color="primary" label="Logout" @click="logout"/>
    </div>
    <div><br/></div>
    <div class="details">
        <div class="ownername">
          <ilabel value="Owner Name :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="name" style="font-size: 20px;"></q-input>
        </div>

        <div class="address">
          <ilabel value="Address :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="address" style="font-size: 20px;"></q-input>
        </div>
        <div class="location">
          <ilabel value="Location of Application :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="location" style="font-size: 20px;"><q-btn v-if="appid > 0" flat color="primary" label="Locate" @click="showmap" /></q-input>
        </div>
        <div class="scope">
          <ilabel value="Scope of Work :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="scope" style="font-size: 20px;"></q-input>
        </div>
        <div class="typeoruse">
          <ilabel value="Type or Use :"></ilabel>
          <q-input readonly bg-color="blue-grey-3" filled v-model="typeoruse" style="font-size: 20px;"></q-input>
        </div>
    </div>
    <div><br/><br/></div>
    <!-- <div v-for="access in access">
        {{access}}
    </div> -->

    <div class="typeofcon" v-if="appid > 0">
      <label>Type of Construction :</label><br />
      <q-btn-dropdown v-if="savedTypeBool" split unelevated color="white" text-color="black" @input="checkSavedDropdown">
        <template v-slot:label>
          <div class="row items-center no-wrap">
            <div class="text-center">{{selectedType}}</div>
          </div>
        </template>

        <q-list>
          <q-item clickable v-close-popup @click="setType('Type I')">
            <q-item-section>
              <q-item-label>Type I</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setType('Type II')">
            <q-item-section>
              <q-item-label>Type II</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setType('Type III-A')">
            <q-item-section>
              <q-item-label>Type III-A</q-item-label>
            </q-item-section>
          </q-item>

           <q-item clickable v-close-popup @click="setType('Type III-B')">
            <q-item-section>
              <q-item-label>Type III-B</q-item-label>
            </q-item-section>
          </q-item>

           <q-item clickable v-close-popup @click="setType('Type IV')">
            <q-item-section>
              <q-item-label>Type IV</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setType('Type V')">
            <q-item-section>
              <q-item-label>Type V</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

       <q-btn-dropdown v-else disable-dropdown split unelevated color="white" text-color="black">
        <template v-slot:label>
          <div class="row items-center no-wrap">
            <div class="text-center">{{selectedType}}</div>
          </div>
        </template>
      </q-btn-dropdown>
    </div>

    <div class="dtable" v-if="userdefaultaccess">
        <q-table class="datatable" title="Findings" :data="empdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom></q-table>
    </div>

    <div class="dtable" v-if="userbuildinglgaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Line and Grade" :data="bldglgdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" row-key="name" flat hide-bottom>
        <template v-slot:top v-if="appid > 0">
          <label style="color: black; font-size:1rem">Findings for Building Line and Grade</label>
          <q-space />
          <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildinglineandgrade = true" />
          <!-- <q-btn class="on-right mobilemode" flat dense color="orange-10" :disable="loading" label="Remove last" @click="removebuildinglineandgrade" /> -->
          <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildinglineandgrade" />
          <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldglgdata, 'LINE AND GRADE')" />
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building LG')">
            <q-td key="description" :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" title="Edit Data">
                <q-input v-model="props.row.name" dense autofocus />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldglgdata, 'LINE AND GRADE')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt" @click="gotoCamera"/>

        <q-dialog v-model="deleterowblg" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildinglineandgrade(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancylgaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Line and Grade" :data="occlgdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Line and Grade</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancylineandgrade = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancylineandgrade" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occlgdata, 'LINE AND GRADE')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy LG')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occlgdata, 'LINE AND GRADE')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowolg" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancylineandgrade(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingarchaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Architecture" :data="bldgarchdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Architecture</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingarchitecture = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingarchitecture" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgarchdata, 'ARCHITECTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Arch')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgarchdata, 'ARCHITECTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbar" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingarchitecture(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancyarchaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Architecture" :data="occarchdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Architecture</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancyarchitecture = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancyarchitecture" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occarchdata, 'ARCHITECTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Arch')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occarchdata, 'ARCHITECTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowoar" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancyarchitecture(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingstructaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Structural" :data="bldgstructdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Structural</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingstructural = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingstructural" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgstructdata, 'STRUCTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Struct')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgstructdata, 'STRUCTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbst" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingstructural(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancystructaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Structural" :data="occstructdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Structural</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancystructural = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancystructural" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occstructdata, 'STRUCTURAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Struct')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occstructdata, 'STRUCTURAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowost" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancystructural(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingplumaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Sanitary/Plumbing" :data="bldgplumdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Sanitary/Plumbing</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingplumbing = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingplumbing" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgplumdata, 'SANITARY/PLUMBING')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Plum')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgplumdata, 'SANITARY/PLUMBING')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbpl" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingplumbing(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancyplumaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Sanitary/Plumbing" :data="occplumdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Sanitary/Plumbing</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancyplumbing = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancyplumbing" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occplumdata, 'SANITARY/PLUMBING')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Plum')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occplumdata, 'SANITARY/PLUMBING')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowopl" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancyplumbing(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingelecaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Sanitary/Plumbing" :data="bldgelecdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Electrical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingelectrical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingelectrical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgelecdata, 'ELECTRICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Elec')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgelecdata, 'ELECTRICAL')" />
        <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

        <q-dialog v-model="deleterowbel" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingelectrical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancyelecaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Sanitary/Plumbing" :data="occelecdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Electrical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancyelectrical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancyelec" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occelecdata, 'ELECTRICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Elec')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occelecdata, 'ELECTRICAL')" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowoel" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancyelectrical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="userbuildingmechaccess">
      <br/>
      <q-table class="datatable" title="Findings for Building Sanitary/Plumbing" :data="bldgmechdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Building Mechanical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbuildingmechanical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbuildingmechanical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgmechdata, 'MECHANICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Building Mech')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveBuilding2(bldgmechdata, 'MECHANICAL')" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowbme" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebuildingmechanical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="useroccupancymechaccess">
      <br/>
      <q-table class="datatable" title="Findings for Occupancy Sanitary/Plumbing" :data="occmechdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Occupancy Mechanical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addoccupancymechanical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearalloccupancymech" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occmechdata, 'MECHANICAL')" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Occupancy Mech')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveOccupancy2(occmechdata, 'MECHANICAL')" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowome" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
            <q-card-section>
              <div class="text-h6">Delete this Item</div>
            </q-card-section>

            <q-card-actions align="right" class="bg-blue-grey-9">
              <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeoccupancymechanical(deleteitem)"/>
              <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>
    </div>

    <div class="dtable" v-if="usersignageaccess">
      <br/>
      <q-table class="datatable" title="Findings for Signage" :data="signdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Signage</label>
            <q-space />
            <q-btn v-if="signageallowadd" flat dense color="secondary" :disable="loading" label="Add row" @click="addsignagerow = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallsignage" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveSignage2" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Signage')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveSignage2" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowsig" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removesignage(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="dtable" v-if="userelectricalaccess">
      <br/>
      <q-table class="datatable" title="Findings for Electrical" :data="elecdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Electrical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addelectrical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallelectrical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveElectrical2" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Electrical')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveElectrical2" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowele" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removeelectrical(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div class="dtable" v-if="usermechanicalaccess">
      <br/>
      <q-table class="datatable" title="Findings for Mechanical" :data="mechdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Mechanical</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addmechanical = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallmechanical" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save" @click="saveMechanical2" />
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Mechanical')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" @click="saveMechanical2" />
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowmec" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removemechanical(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

     <div class="dtable" v-if="userzoningaccess">
      <br/>
      <q-table class="datatable" title="Findings for Land Use and Zoning" :data="zoningdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Land Use and Zoning</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addzoning = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallzoning" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save"/> <!-- @click="saveZoning" -->
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'Zoning')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" /> <!-- @click="saveZoning" -->
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowzon" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removezoning(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

     <div class="dtable" v-if="userbfpaccess">
      <br/>
      <q-table class="datatable" title="Findings for Land Use and Zoning" :data="bfpdata" :columns="columns" :table-style="{ backgroundColor: '#cfd8dc' }" flat hide-bottom>
          <template v-slot:top v-if="appid > 0">
            <label style="color: black; font-size:1rem">Findings for Bureau of Fire</label>
            <q-space />
            <q-btn flat dense color="secondary" :disable="loading" label="Add row" @click="addbfp = true" />
            <q-btn class="on-right mobilemode" flat dense color="red" :disable="loading" label="Clear All" @click="clearallbfp" />
            <q-btn class="on-right mobilemode" color="secondary" :disable="loading" label="Save"/> <!-- @click="saveBFP" -->
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click.native="props.selected = !props.selected" v-touch-swipe.mouse.right.left="handler(props.row.name, 'BFP')">
              <q-td key="description" :props="props">
                {{ props.row.name }}
                <q-popup-edit v-model="props.row.name" title="Edit Data">
                  <q-input v-model="props.row.name" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
      </q-table>
      <q-btn class="on-right mobilemode2" color="secondary" :disable="loading" label="Save" /> <!-- @click="saveBFP" -->
      <q-btn class="on-right tab-mob" color="secondary" :disable="loading" label="Add Photo" icon="camera_alt"/>

      <q-dialog v-model="deleterowbfp" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
          <q-card-section>
            <div class="text-h6">Delete this Item</div>
          </q-card-section>

          <q-card-actions align="right" class="bg-blue-grey-9">
            <q-btn flat class="text-green-5" label="Delete" v-close-popup @click="removebfp(deleteitem)"/>
            <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- <q-dialog v-model="addrow">
      <q-card>
        <q-card-section dark style="background: #ffab40;">
          <div class="text-h6">Add Findings</div>
        </q-card-section>
        <q-carousel
          v-model="slide"
          transition-prev="scale"
          transition-next="scale"
          swipeable
          animated
          control-color="white"
          navigation
          padding
          arrows
          height="300px"
          class="bg-primary text-white shadow-1 rounded-borders"
        >
        <q-carousel-slide name="style" class="column no-wrap flex-center" style="background: #2979ff;">
          <label>Description</label>
          <q-input dark v-model="sdescription" :dense="dense" size="100px"/>
        </q-carousel-slide>
        <q-carousel-slide name="tv" class="column no-wrap flex-center wide">
          <label>Date Started</label>
          <q-input filled v-model="sdatestart" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="sdatestart" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-carousel-slide>
        <q-carousel-slide name="layers" class="column no-wrap flex-center">
          <label>Date Ended</label>
          <q-input filled v-model="sdateend" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="sdateend" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-carousel-slide>
        </q-carousel>
        <q-card-section v-if="sdescription !== ''" style="background: #2979ff;">
          <q-btn unelevated class="dialogbutton" color="primary" label="Save" @click="addFinder"/>
        </q-card-section>
       </q-card>
    </q-dialog> -->
    <q-dialog v-model="addrow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined class="bg-white" v-model="sdescription" :dense="dense"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addFinder"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildinglineandgrade" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Line and Grade</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingLG"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingLG"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancylineandgrade" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Line and Grade</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyLG"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyLG"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingarchitecture" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Architecture</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingArch"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingArch"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancyarchitecture" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Architecture</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyArch"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyArch"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingstructural" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Structural</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingStruct"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingStruct"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancystructural" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Structural</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyStruct"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyStruct"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingplumbing" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Sanitary/Plumbing</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingPlum"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingPlum"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancyplumbing" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Sanitary/Plumbing</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyPlum"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyPlum"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingelectrical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Electrical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingElec"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingElec"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancyelectrical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Electrical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyElec"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyElec"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbuildingmechanical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Building Mechanical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBuildingMech"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBuildingMech"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addoccupancymechanical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Occupancy Mechanical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addOccupancyMech"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addOccupancyMech"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

     <q-dialog v-model="addsignagerow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Signage</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addSignage"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addSignage"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

     <q-dialog v-model="addelectrical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Electrical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addElectrical"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addElectrical"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

     <q-dialog v-model="addmechanical" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Mechanical</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addMechanical"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addMechanical"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addzoning" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Land Use and Zoning</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addZoning"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addZoning"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addbfp" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-3 text-blue-grey-10" style="width: 1200px;">
        <q-card-section>
          <div class="text-h6">Add Findings for Bureau of Fire</div>
        </q-card-section>

        <q-card-section>
          <q-input outlined autofocus class="bg-white" v-model="sdescription" :dense="dense" @keydown.enter="addBFP"/>
        </q-card-section>

        <q-card-actions align="right" class="bg-blue-grey-9">
          <q-btn flat class="text-green-5" label="Add" v-close-popup @click="addBFP"/>
          <q-btn flat class="text-red-9" label="Cancel" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <br/><br/>
    <!-- <div class="saveArea" v-if="appid > 0">
      <q-btn unelevated class="savebutton" color="primary" icon="check" label="Save" @click="saveData" />
    </div> -->
<!-- //v-model="maps"  -->
    <q-dialog v-model="map" :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down" style="opactity: 0.5">
      <q-card class="bg-primary text-white" style="opacity: 0.9">

        <q-card-section>
          <div class="text-h6">OCBO Map</div>
        </q-card-section>

        <!-- <q-card-section>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.5305885202456!2d125.6059840142885!3d7.064307018600934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96d78c7550851%3A0xc577efa1d368e43a!2sCITY%20ENGINEER&#39;S%20OFFICE!5e0!3m2!1sen!2sph!4v1570517118419!5m2!1sen!2sph" width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
        </q-card-section> -->

        <q-card-section>
          <!-- <LeafletMap></LeafletMap> -->
        </q-card-section>

        <q-card-section class="row justify-center">
          <q-btn unelevated class="mapbutton" color="positive" label="OK" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Swal from 'sweetalert2'
const l3s = require('../assets/js/L3S')
const iips = require('../assets/js/functions')
const json = require('zipson')

//* *Google Map */
// const googleMapsClient = require('@google/maps').createClient({
//   key: 'AIzaSyCELqGbuiRTNUSJ5oYMuPo040X4WJggEzk',
//   Promise: Promise
// })

//* *Import of Components */
import ilabel from 'components/i-label'

export default {
  name: 'Main',
  data () {
    return {
      dark: false,
      appno: '',
      appid: 0,
      employeeid: 0,
      name: '',
      address: '',
      location: '',
      scope: '',
      typeoruse: '',
      loading: false,
      addrow: false,
      slide: 'style',
      sdescription: '',
      sdatestart: '',
      sdateend: '',
      dense: false,
      allowsave: false,
      userdefaultaccess: true,
      userbuildinglgaccess: false,
      useroccupancylgaccess: false,
      userbuildingarchaccess: false,
      useroccupancyarchaccess: false,
      userbuildingstructaccess: false,
      useroccupancystructaccess: false,
      userbuildingplumaccess: false,
      useroccupancyplumaccess: false,
      userbuildingelecaccess: false,
      useroccupancyelecaccess: false,
      userbuildingmechaccess: false,
      useroccupancymechaccess: false,
      userzoningaccess: false,
      usersignageaccess: false,
      userelectricalaccess: false,
      usermechanicalaccess: false,
      userbfpaccess: false,
      addbuildinglineandgrade: false,
      addoccupancylineandgrade: false,
      addbuildingarchitecture: false,
      addoccupancyarchitecture: false,
      addbuildingstructural: false,
      addoccupancystructural: false,
      addbuildingplumbing: false,
      addoccupancyplumbing: false,
      addbuildingelectrical: false,
      addoccupancyelectrical: false,
      addbuildingmechanical: false,
      addoccupancymechanical: false,
      addzoning: false,
      addsignagerow: false,
      addelectrical: false,
      addmechanical: false,
      addbfp: false,
      columns: [
        {
          name: 'description',
          required: true,
          label: 'Description',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        }
      ],
      bldglgdata: [],
      occlgdata: [],
      bldgarchdata: [],
      occarchdata: [],
      bldgstructdata: [],
      occstructdata: [],
      bldgplumdata: [],
      occplumdata: [],
      bldgelecdata: [],
      occelecdata: [],
      bldgmechdata: [],
      occmechdata: [],
      zoningdata: [],
      signdata: [],
      elecdata: [],
      mechdata: [],
      bfpdata: [],
      empdata: [],
      map: false,
      maximizedToggle: true,
      geolocation: '',
      geoLat: '',
      geoLong: '',
      isDataEmpty: true,
      okSaved: false,
      savetable: [],
      selected: [],
      info: null,
      deleterow: false,
      deleteitem: '',
      deleterowblg: false,
      deleterowolg: false,
      deleterowbar: false,
      deleterowoar: false,
      deleterowbst: false,
      deleterowost: false,
      deleterowbpl: false,
      deleterowopl: false,
      deleterowbel: false,
      deleterowoel: false,
      deleterowbme: false,
      deleterowome: false,
      deleterowsig: false,
      deleterowele: false,
      deleterowmec: false,
      deleterowzon: false,
      deleterowbfp: false,
      dateStart: '',
      signageallowadd: true,
      selectedicon: 'Please Select a Type',
      savedicon: null,
      savedTypeBool: true,
      savedbldgLG: 0,
      savedbldgLGMsg: null,
      savedbldgArch: 0,
      savedbldgStruct: 0,
      savedbldgStructMsg: null,
      savedbldgPlum: 0,
      savedbldgPlumMsg: null,
      savedbldgElec: 0,
      savedbldgElecMsg: null,
      savedbldgMech: 0,
      savedbldgMechMsg: null,
      savedbldgZoning: 0,
      savedbldgZoningMsg: null,
      savedbldgBFP: 0,
      savedbldgBFPMsg: null,

      savedoccLG: 0,
      savedoccLGMsg: null,
      savedoccArch: 0,
      savedoccStruct: 0,
      savedoccStructMsg: null,
      savedoccPlum: 0,
      savedoccPlumMsg: null,
      savedoccElec: 0,
      savedoccElecMsg: null,
      savedoccMech: 0,
      savedoccMechMsg: null,
      savedoccZoning: 0,
      savedoccZoningMsg: null,
      savedoccBFP: 0,
      savedoccBFPMsg: null,

      savedSignage: 0,
      savedSignageMsg: null,

      savedElectrical: 0,
      savedElectricalMsg: null,

      savedMechanical: 0,
      savedMechanicalMsg: null,

      selectedType: 'Please Select a Type',
      images: [],
      imagesUnique: []
    }
  },
  computed: {},
  components: {
    ilabel
  },
  methods: {
    checkSavedDropdown () {
      if (this.savedType !== null) {
        if (this.selectedType !== this.savedType) {
          this.savedTypeBool = true
        } else {
          this.savedTypeBool = false
        }
      }
    },
    intro () {
      return new Promise((resolve, reject) => {
        const load = true
        if (load) {
          resolve()
        } else {
          reject()
        }
      })
    },
    checkDark () {
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('dark') + '_token') === true) {
        this.dark = true
      } else {
        this.dark = false
      }
    },
    async gotoCamera () {
      // this.$router.push('camera', () => {})
      const camera = await document.getElementById('camera')
      camera.click()
      camera.addEventListener('change', () => {
        this.saveImages(camera.files[0])
      })
    },
    setType (value) {
      this.selectedType = value
    },
    checkLogin () {
      if (this.$q.localStorage.has('__' + l3s.Encrypt('id') + '_token') === true) {
        this.$router.push('main', () => {})
      } else {
        this.$router.push('/', () => {})
      }
    },
    async checkAuth () {
      const authTitle = await l3s.Encrypt('auth')
      if (this.$q.localStorage.has('__' + authTitle + '_auth') === true) {
        this.$router.push('main', () => {})
      } else {
        this.$router.push('/', () => {})
      }
    },
    logout () {
      const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))
      const darkmode = this.$q.sessionStorage.has('__' + l3s.Encrypt('dark') + '_token')
      const authTitle = l3s.Encrypt('auth')

      this.$axios.put('/api/setOnline/' + (empid), {
        is_online: 0
      })
      this.$q.sessionStorage.clear()
      if (darkmode) {
        this.$q.sessionStorage.set('__' + l3s.Encrypt('dark') + '_token', l3s.EncryptNetwork(true))
      }

      this.$q.localStorage.remove('__' + authTitle + '_auth')
      this.$q.localStorage.remove('__' + l3s.Encrypt('id') + '_token')
      this.$router.push('/', () => {})
    },
    async loadData () {
      this.$q.loading.show({
        message: 'Fetching Data',
        spinnerSize: 120,
        backgroundColor: '#507f95'
      })

      if (this.appno.length === 9) { // Building
        // let buildingList = await this.$q.localStorage.has('__' + l3s.Encrypt('buildingList') + '_token')
        // if (buildingList) {
        //   let listofbuilding = await l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('buildingList') + '_token'))
        //   let listofbuildingJSON = json.parse(listofbuilding)

        //   for (let i = 0; i < listofbuildingJSON.length; i++) {
        //     if (listofbuildingJSON[i].twoa === this.appno) {
        //       this.appid = await listofbuildingJSON[i].oner
        //       break
        //     }
        //   }

        //   let docflowList = this.$q.localStorage.has('__' + l3s.Encrypt('docflowList') + '_token')
        //   if (docflowList) {
        //     let listofdocflow = await l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('docflowList') + '_token'))
        //     let listofdocflowJSON = json.parse(listofdocflow)

        //     for (let i = 0; i < listofdocflowJSON.length; i++) {
        //       if (listofdocflowJSON[i].oner === this.appid) {
        //         // let allow = await listofdocflowJSON[i].oner
        //         // console.log('allow: ' + allow)
        //         this.$q.loading.hide()
        //         break
        //       }
        //     }
        //   }
        // } else {
        await this.$axios.get('/api/GetReceivingID/' + this.appno)
          .then((response) => {
            const decrypted = response.data[0].receivingid
            // let jsonize = JSON.parse(decrypted)
            // let sample = json.parse(jsonize)
            this.appid = decrypted
            // console.log('decrypted: ' + jsonize)

            if (this.appid > 0) {
              this.$axios.get('/api/getLastStatusBldg' + '/' + (this.appid))
                .then((response) => {
                  const decrypted = response.data[0].remarks
                  // let jsonize = JSON.parse(decrypted)
                  const remarks = decrypted

                  if (remarks.includes('ZONING')) {
                    this.$axios.get('/api/getCustomerReceiving' + '/' + (this.appid))
                      .then((response) => {
                        const decrypted = response.data[0]
                        // let jsonize = JSON.parse(decrypted)
                        const fname = decrypted.firstName
                        const mname = decrypted.middleInitial
                        const lname = decrypted.lastName
                        const ffname = iips.fullName(fname, mname, lname, null, null, null)
                        this.name = ffname
                        this.address = decrypted.address
                        this.location = decrypted.locationofconstruction
                        this.scope = decrypted.workscope
                        const occupancy = decrypted.occupancy
                        const occupancytype = decrypted.occupancyType
                        this.typeoruse = occupancy + ' - ' + occupancytype
                        this.loadTables()
                        this.saveInfo()
                      })
                      .catch((err) => {
                        this.$q.loading.hide()
                        if (err.message === 'Network Error') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Unable to Search Building',
                            text: 'No Connection on Server'
                          })
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: err.message
                          })
                        }
                      })
                  } else if (remarks.includes('INSPECTED')) {
                    this.$axios.get('/api/getCustomerReceiving' + '/' + (this.appid))
                      .then((response) => {
                        const decrypted = response.data[0]
                        const fname = decrypted.firstName
                        const mname = decrypted.middleInitial
                        const lname = decrypted.lastName
                        const ffname = iips.fullName(fname, mname, lname, null, null, null)
                        this.name = ffname
                        this.address = decrypted.address
                        this.location = decrypted.locationofconstruction
                        this.scope = decrypted.workscope
                        const occupancy = decrypted.occupancy
                        const occupancytype = decrypted.occupancyType
                        this.typeoruse = occupancy + ' - ' + occupancytype
                        this.loadTables()
                        this.saveInfo()
                      })
                      .catch((err) => {
                        this.$q.loading.hide()
                        if (err.message === 'Network Error') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Unable to Search Building',
                            text: 'No Connection on Server'
                          })
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: err.message
                          })
                        }
                      })
                  } else {
                    this.$q.loading.hide()
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Building Application not ready for Inspection'
                    })
                    this.appno = ''
                    this.clearData()
                  }
                })
                .catch((err) => {
                  this.$q.loading.hide()
                  if (err.message === 'Network Error') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Unable to Search Building',
                      text: 'No Connection on Server'
                    })
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error1',
                      text: err.message
                    })
                  }
                })
            } else {
              this.$q.loading.hide()
              Swal.fire({
                icon: 'error',
                title: 'Invalid Search',
                text: 'Building Application Number does not exist'
              })
              this.appno = ''
            }
          })
          .catch((err) => {
            this.$q.loading.hide()
            if (err.message === 'Network Error') {
              Swal.fire({
                icon: 'error',
                title: 'Search Error',
                text: 'No Connection on Server'
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Search',
                text: 'Building Application Number does not exist'
              })
            }
          })
        // }
      } else if (this.appno.length === 8) { // Occupancy
        this.$axios.get('/api/getOccupancyID' + '/' + (this.appno))
          .then((response) => {
            this.appid = response.data[0].occupancyid
            // console.log(this.appid)

            if (this.appid > 0) {
              this.$axios.get('/api/getLastStatusOcc' + '/' + (this.appid))
                .then((response) => {
                  const remarks = response.data[0].remarks

                  if (remarks.includes('INSPECTION')) {
                    this.$axios.get('/api/getCustomerOccupancy' + '/' + (this.appid))
                      .then((response) => {
                        const result = response.data
                        const fname = result[0].firstName
                        const mname = result[0].middleInitial
                        const lname = result[0].lastName
                        const ffname = iips.fullName(fname, mname, lname, null, null, null)
                        this.name = ffname
                        this.address = result[0].address
                        this.location = result[0].locationConstruction
                        this.scope = result[0].workscope
                        const occupancy = result[0].occupancy
                        const occupancytype = result[0].occupancyType
                        this.typeoruse = occupancy + ' - ' + occupancytype

                        this.loadTables()
                        this.saveInfo()
                      })
                  } else {
                    this.$q.loading.hide()
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Occupancy Application not ready for Inspection'
                    })
                    this.appno = ''
                    this.clearData()
                  }
                })
                .catch((err) => {
                  this.$q.loading.hide()
                  if (err.message === 'Network Error') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Unable to Search',
                      text: 'No Connection on Server'
                    })
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: err.message
                    })
                  }
                })
            } else {
              this.$q.loading.hide()
              Swal.fire({
                icon: 'error',
                title: 'Occupancy Application Number does not exist'
              })
              this.appno = ''
              this.clearData()
            }
          })
          .catch((err) => {
            this.$q.loading.hide()
            if (err.message === 'Network Error') {
              Swal.fire({
                icon: 'error',
                title: 'Unable to Search',
                text: 'No Connection on Server'
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Search',
                text: 'Occupancy Application Number does not exist'
              })
            }
            this.appno = ''
            this.clearData()
          })
      } else if (this.appno.length === 10) { // Electrical
        // this.$q.loading.hide()
        // this.clearData()

        this.$axios.get('/api/getElectricalID' + '/' + (this.appno))
          .then((response) => {
            this.appid = response.data[0].electricalid

            if (this.appid > 0) {
              this.$axios.get('/api/getLastStatusElec' + '/' + (this.appid))
                .then((response) => {
                  const istag = response.data[0].is_tag
                  const isapprove = response.data[0].is_approve

                  // console.log('is_tag: ' + istag)
                  // console.log('is_approve: ' + isapprove)

                  if (istag === '87' && isapprove === 0) {
                    this.$axios.get('/api/getCustomerElectrical' + '/' + (this.appid))
                      .then((response) => {
                        const fname = response.data[0].firstName
                        const mname = response.data[0].middleInitial
                        const lname = response.data[0].lastName
                        const ffname = iips.fullName(fname, mname, lname, null, null, null)
                        this.name = ffname
                        this.address = response.data[0].address
                        this.location = response.data[0].locationofinstallation
                        this.scope = response.data[0].scopeofwork
                        const occupancy = response.data[0].occupancy
                        const occupancytype = response.data[0].occupancyoruse
                        this.typeoruse = occupancy + ' - ' + occupancytype
                        this.loadTables()
                        this.saveInfo()
                      })
                      .catch((err) => {
                        this.$q.loading.hide()
                        if (err.message === 'Network Error') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Unable to Search',
                            text: 'No Connection on Server'
                          })
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Invalid Search',
                            text: 'Electrical Application Number does not exist'
                          })
                        }
                        this.appno = ''
                        this.clearData()
                      })
                  } else {
                    this.$q.loading.hide()
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Electrical Application not ready for Inspection'
                    })
                    this.appno = ''
                    this.clearData()
                  }
                })
                .catch((err) => {
                  this.$q.loading.hide()
                  if (err.message === 'Network Error') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Unable to Search',
                      text: 'No Connection on Server'
                    })
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Electrical Application Number does not exist'
                    })
                  }
                  this.appno = ''
                  this.clearData()
                })
            } else {
              this.$q.loading.hide()
              Swal.fire({
                icon: 'error',
                title: 'Electrical Application Number does not exist'
              })
              this.appno = ''
              this.clearData()
            }
          })
          .catch((err) => {
            this.$q.loading.hide()
            if (err.message === 'Network Error') {
              Swal.fire({
                icon: 'error',
                title: 'Unable to Search',
                text: 'No Connection on Server'
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Search',
                text: 'Electrical Application Number does not exist'
              })
            }
            this.appno = ''
            this.clearData()
          })
      } else if (this.appno.length === 11) { // Signage
        // this.$q.loading.hide()
        // this.clearData()

        this.$axios.get('/api/getSignageID' + '/' + (this.appno))
          .then((response) => {
            this.appid = response.data[0].signageid

            if (this.appid > 0) {
              this.$axios.get('/api/getLastStatusSign' + '/' + (this.appid))
                .then((response) => {
                  const istag = response.data[0].is_tag

                  if (istag === 66) {
                    this.$axios.get('/api/getCustomerSignage' + '/' + (this.appid))
                      .then((response) => {
                        const fname = response.data[0].firstName
                        const mname = response.data[0].middleInitial
                        const lname = response.data[0].lastName
                        const ffname = iips.fullName(fname, mname, lname, null, null, null)
                        this.name = ffname
                        this.address = response.data[0].address
                        this.location = response.data[0].locationofsign
                        this.scope = response.data[0].scopeofwork
                        const occupancy = response.data[0].typedescription
                        const occupancytype = response.data[0].signType
                        this.typeoruse = occupancy + ' - ' + occupancytype
                        this.loadTables()
                        this.saveInfo()
                      })
                      .catch((err) => {
                        this.$q.loading.hide()
                        if (err.message === 'Network Error') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Unable to Search',
                            text: 'No Connection on Server'
                          })
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Invalid Search',
                            text: 'Signage Application Number does not exist'
                          })
                        }
                        this.appno = ''
                        this.clearData()
                      })
                  } else {
                    this.$q.loading.hide()
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Signage Application not ready for Inspection'
                    })
                    this.appno = ''
                    this.clearData()
                  }
                })
                .catch((err) => {
                  this.$q.loading.hide()
                  if (err.message === 'Network Error') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Unable to Search',
                      text: 'No Connection on Server'
                    })
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Signage Application Number does not exist'
                    })
                  }
                  this.appno = ''
                  this.clearData()
                })
            } else {
              this.$q.loading.hide()
              Swal.fire({
                icon: 'error',
                title: 'Signage Application Number does not exist'
              })
              this.appno = ''
              this.clearData()
            }
          })
          .catch((err) => {
            this.$q.loading.hide()
            if (err.message === 'Network Error') {
              Swal.fire({
                icon: 'error',
                title: 'Unable to Search',
                text: 'No Connection on Server'
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Search',
                text: 'Signage Application Number does not exist'
              })
            }
            this.appno = ''
            this.clearData()
          })
      } else if (this.appno.length === 7) { // Mechanical
        // this.$q.loading.hide()
        // this.clearData()

        this.$axios.get('/api/getMechanicalID' + '/' + (this.appno))
          .then((response) => {
            this.appid = response.data[0].mechanicalid

            if (this.appid > 0) {
              this.$axios.get('/api/getLastStatusMech' + '/' + (this.appid))
                .then((response) => {
                  const istag = response.data[0].is_tag
                  const isapprove = response.data[0].is_approve

                  if (istag === '106' && isapprove === 0) {
                    this.$axios.get('/api/getCustomerMechanical' + '/' + (this.appid))
                      .then((response) => {
                        const fname = response.data[0].firstName
                        const mname = response.data[0].middleInitial
                        const lname = response.data[0].lastName
                        const ffname = iips.fullName(fname, mname, lname, null, null, null)
                        this.name = ffname
                        this.address = response.data[0].address
                        this.location = response.data[0].locationofmech
                        this.scope = response.data[0].scopeofwork
                        const occupancy = response.data[0].typeofoccupancy
                        this.typeoruse = occupancy
                        this.loadTables()
                        this.saveInfo()
                      })
                      .catch((err) => {
                        this.$q.loading.hide()
                        if (err.message === 'Network Error') {
                          Swal.fire({
                            icon: 'error',
                            title: 'Unable to Search',
                            text: 'No Connection on Server'
                          })
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Invalid Search',
                            text: 'Mechanical Application Number does not exist'
                          })
                        }
                        this.appno = ''
                        this.clearData()
                      })
                  } else {
                    this.$q.loading.hide()
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Mechanical Application not ready for Inspection'
                    })
                    this.appno = ''
                    this.clearData()
                  }
                })
                .catch((err) => {
                  this.$q.loading.hide()
                  if (err.message === 'Network Error') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Unable to Search',
                      text: 'No Connection on Server'
                    })
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Invalid Search',
                      text: 'Mechanical Application Number does not exist'
                    })
                  }
                  this.appno = ''
                  this.clearData()
                })
            } else {
              this.$q.loading.hide()
              Swal.fire({
                icon: 'error',
                title: 'Mechanical Application Number does not exist'
              })
              this.appno = ''
              this.clearData()
            }
          })
          .catch((err) => {
            this.$q.loading.hide()
            if (err.message === 'Network Error') {
              Swal.fire({
                icon: 'error',
                title: 'Unable to Search',
                text: 'No Connection on Server'
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Search',
                text: 'Mechanical Application Number does not exist'
              })
            }
            this.appno = ''
            this.clearData()
          })
      } else if (this.appno.length < 7) {
        this.$q.loading.hide()
        this.clearData()
      }
      const currentDate = new Date()
      const month = currentDate.getMonth() + 1
      const day = currentDate.getDate()
      const year = currentDate.getFullYear()
      const fulldate = month + '/' + day + '/' + year
      const fulldateSignage = year + '-' + month + '-' + day
      const fulldate2 = year + '-' + month + '-' + day
      this.$q.sessionStorage.set('__' + l3s.Encrypt('dateStart') + '_token', l3s.EncryptNetwork(fulldate))
      this.$q.sessionStorage.set('__' + l3s.Encrypt('dateStartSignage') + '_token', l3s.EncryptNetwork(fulldateSignage))
      this.$q.sessionStorage.set('__' + l3s.Encrypt('dateStart2') + '_token', l3s.EncryptNetwork(fulldate2))
    },
    saveInfo () {
      if (this.appno !== '') {
        this.$q.sessionStorage.set('__' + l3s.Encrypt('info_appno') + '_token', l3s.EncryptNetwork(this.appno))
      }
      if (this.name !== '') {
        this.$q.sessionStorage.set('__' + l3s.Encrypt('info_name') + '_token', l3s.EncryptNetwork(this.name))
      }
      if (this.address !== '') {
        this.$q.sessionStorage.set('__' + l3s.Encrypt('info_address') + '_token', l3s.EncryptNetwork(this.address))
      }
      if (this.location !== '') {
        this.$q.sessionStorage.set('__' + l3s.Encrypt('info_location') + '_token', l3s.EncryptNetwork(this.location))
      }
      if (this.scope !== '') {
        this.$q.sessionStorage.set('__' + l3s.Encrypt('info_scope') + '_token', l3s.EncryptNetwork(this.scope))
      }
      if (this.typeoruse !== '') {
        this.$q.sessionStorage.set('__' + l3s.Encrypt('info_typeoruse') + '_token', l3s.EncryptNetwork(this.typeoruse))
      }
    },
    fetchInfo () {
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('info_appno') + '_token') === true) {
        this.appno = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('info_appno') + '_token'))
      }
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('info_name') + '_token') === true) {
        this.name = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('info_name') + '_token'))
      }
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('info_address') + '_token') === true) {
        this.address = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('info_address') + '_token'))
      }
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('info_location') + '_token') === true) {
        this.location = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('info_location') + '_token'))
      }
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('info_scope') + '_token') === true) {
        this.scope = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('info_scope') + '_token'))
      }
      if (this.$q.sessionStorage.has('__' + l3s.Encrypt('info_typeoruse') + '_token') === true) {
        this.typeoruse = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('info_typeoruse') + '_token'))
      }
    },
    clearData () {
      this.appid = 0
      this.name = ''
      this.address = ''
      this.location = ''
      this.scope = ''
      this.typeoruse = ''
      this.userdefaultaccess = true
      this.userbuildinglgaccess = false
      this.useroccupancylgaccess = false
      this.userbuildingarchaccess = false
      this.useroccupancyarchaccess = false
      this.userbuildingstructaccess = false
      this.useroccupancystructaccess = false
      this.userbuildingplumaccess = false
      this.useroccupancyplumaccess = false
      this.userbuildingelecaccess = false
      this.useroccupancyelecaccess = false
      this.userbuildingmechaccess = false
      this.useroccupancymechaccess = false
      this.userzoningaccess = false
      this.usersignageaccess = false
      this.userelectricalaccess = false
      this.usermechanicalaccess = false
      this.userbfpaccess = false
      this.data = []
      this.bldglgdata = []
      this.bldgarchdata = []
      this.bldgstructdata = []
      this.bldgplumdata = []
      this.occlgdata = []
      this.occarchdata = []
      this.occstructdata = []
      this.occplumdata = []
      this.signdata = []
      this.elecdata = []
      this.mechdata = []
      this.zoningdata = []
      this.bfpdata = []
      this.savetable = []
      this.selected = []
      this.map = false
      this.maximizedToggle = true
      this.geolocation = ''
      this.geoLat = ''
      this.geoLong = ''
      this.isDataEmpty = true
      this.okSaved = false
      this.deleterowblg = false
      this.deleterowolg = false
      this.deleterowbar = false
      this.deleterowoar = false
      this.deleterowbst = false
      this.deleterowost = false
      this.deleterowbpl = false
      this.deleterowopl = false
      this.deleterowbel = false
      this.deleterowoel = false
      this.deleterowbme = false
      this.deleterowome = false
      this.deleterowsig = false
      this.deleterowele = false
      this.deleterowmec = false
      this.deleterowzon = false
      this.deleterowbfp = false
      this.dateStart = ''
      this.signageallowadd = true
      this.selectedType = 'Please Select a Type'
    },
    clearData_search () {
      this.appno = ''
      this.clearData()
    },
    removeRow () {
      this.loading = true
      setTimeout(() => {
        const index = Math.floor(Math.random() * this.data.length)
        this.data = [...this.data.slice(0, index), ...this.data.slice(index + 1)]
        this.loading = false
      }, 100)
    },
    removebuildinglineandgrade (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.bldglgdata.length)
      //   this.bldglgdata = [...this.bldglgdata.slice(0, index), ...this.bldglgdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.bldglgdata.length; i++) {
        if (this.bldglgdata[i].name === value) {
          this.bldglgdata.splice(i, 1)
        }
      }
      if (this.bldglgdata.length === 0) {
        this.clearallbuildinglineandgrade()
      }
    },
    removeoccupancylineandgrade (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.occlgdata.length)
      //   this.occlgdata = [...this.occlgdata.slice(0, index), ...this.occlgdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.occlgdata.length; i++) {
        if (this.occlgdata[i].name === value) {
          this.occlgdata.splice(i, 1)
        }
      }
      if (this.occlgdata.length === 0) {
        this.clearalloccupancylineandgrade()
      }
    },
    removebuildingarchitecture (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.bldgarchdata.length)
      //   this.bldgarchdata = [...this.bldgarchdata.slice(0, index), ...this.bldgarchdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.bldgarchdata.length; i++) {
        if (this.bldgarchdata[i].name === value) {
          this.bldgarchdata.splice(i, 1)
        }
      }
      if (this.bldgarchdata.length === 0) {
        this.clearallbuildingarchitecture()
      }
    },
    removeoccupancyarchitecture (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.occarchdata.length)
      //   this.occarchdata = [...this.occarchdata.slice(0, index), ...this.occarchdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.occarchdata.length; i++) {
        if (this.occarchdata[i].name === value) {
          this.occarchdata.splice(i, 1)
        }
      }
      if (this.occarchdata.length === 0) {
        this.clearalloccupancyarchitecture()
      }
    },
    removebuildingstructural (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.bldgstructdata.length)
      //   this.bldgstructdata = [...this.bldgstructdata.slice(0, index), ...this.bldgstructdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.bldgstructdata.length; i++) {
        if (this.bldgstructdata[i].name === value) {
          this.bldgstructdata.splice(i, 1)
        }
      }
      if (this.bldgstructdata.length === 0) {
        this.clearallbuildingstructural()
      }
    },
    removeoccupancystructural (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.occstructdata.length)
      //   this.occstructdata = [...this.occstructdata.slice(0, index), ...this.occstructdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.occstructdata.length; i++) {
        if (this.occstructdata[i].name === value) {
          this.occstructdata.splice(i, 1)
        }
      }
      if (this.occstructdata.length === 0) {
        this.clearalloccupancystructural()
      }
    },
    removebuildingplumbing (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.bldgplumdata.length)
      //   this.bldgplumdata = [...this.bldgplumdata.slice(0, index), ...this.bldgplumdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.bldgplumdata.length; i++) {
        if (this.bldgplumdata[i].name === value) {
          this.bldgplumdata.splice(i, 1)
        }
      }
      if (this.bldgplumdata.length === 0) {
        this.clearallbuildingplumbing()
      }
    },
    removeoccupancyplumbing (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.occplumdata.length)
      //   this.occplumdata = [...this.occplumdata.slice(0, index), ...this.occplumdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.occplumdata.length; i++) {
        if (this.occplumdata[i].name === value) {
          this.occplumdata.splice(i, 1)
        }
      }
      if (this.occplumdata.length === 0) {
        this.clearalloccupancyplumbing()
      }
    },
    removebuildingelectrical (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.bldgelecdata.length)
      //   this.bldgelecdata = [...this.bldgelecdata.slice(0, index), ...this.bldgelecdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.bldgelecdata.length; i++) {
        if (this.bldgelecdata[i].name === value) {
          this.bldgelecdata.splice(i, 1)
        }
      }
      if (this.bldgelecdata.length === 0) {
        this.clearallbuildingelectrical()
      }
    },
    removeoccupancyelectrical (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.occelecdata.length)
      //   this.occelecdata = [...this.occelecdata.slice(0, index), ...this.occelecdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.occelecdata.length; i++) {
        if (this.occelecdata[i].name === value) {
          this.occelecdata.splice(i, 1)
        }
      }
      if (this.occelecdata.length === 0) {
        this.clearalloccupancyelectrical()
      }
    },
    removebuildingmechanical (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.bldgmechdata.length)
      //   this.bldgmechdata = [...this.bldgmechdata.slice(0, index), ...this.bldgmechdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.bldgmechdata.length; i++) {
        if (this.bldgmechdata[i].name === value) {
          this.bldgmechdata.splice(i, 1)
        }
      }
      if (this.bldgmechdata.length === 0) {
        this.clearallbuildingmechanical()
      }
    },
    removeoccupancymechanical (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.occmechdata.length)
      //   this.occmechdata = [...this.occmechdata.slice(0, index), ...this.occmechdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.occmechdata.length; i++) {
        if (this.occmechdata[i].name === value) {
          this.occmechdata.splice(i, 1)
        }
      }
      if (this.occmechdata.length === 0) {
        this.clearalloccupancymechanical()
      }
    },
    removesignage (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.signdata.length)
      //   this.signdata = [...this.signdata.slice(0, index), ...this.signdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.signdata.length; i++) {
        if (this.signdata[i].name === value) {
          this.signdata.splice(i, 1)
        }
      }
      if (this.signdata.length === 0) {
        this.clearallsignage()
      }
    },
    removeelectrical (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.elecdata.length)
      //   this.elecdata = [...this.elecdata.slice(0, index), ...this.elecdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.elecdata.length; i++) {
        if (this.elecdata[i].name === value) {
          this.elecdata.splice(i, 1)
        }
      }
      if (this.elecdata.length === 0) {
        this.clearallelectrical()
      }
    },
    removemechanical (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.mechdata.length)
      //   this.mechdata = [...this.mechdata.slice(0, index), ...this.mechdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.mechdata.length; i++) {
        if (this.mechdata[i].name === value) {
          this.mechdata.splice(i, 1)
        }
      }
      if (this.mechdata.length === 0) {
        this.clearallmechanical()
      }
    },
    removezoning (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.zoningdata.length)
      //   this.zoningdata = [...this.zoningdata.slice(0, index), ...this.zoningdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.zoningdata.length; i++) {
        if (this.zoningdata[i].name === value) {
          this.zoningdata.splice(i, 1)
        }
      }
      if (this.zoningdata.length === 0) {
        this.clearallzoning()
      }
    },
    removebfp (value) {
      this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.bfpdata.length)
      //   this.bfpdata = [...this.bfpdata.slice(0, index), ...this.bfpdata.slice(index + 1)]
      //   this.loading = false
      // }, 100)
      for (let i = 0; i < this.bfpdata.length; i++) {
        if (this.bfpdata[i].name === value) {
          this.bfpdata.splice(i, 1)
        }
      }
      if (this.bfpdata.length === 0) {
        this.clearallbfp()
      }
    },
    clearAll () {
      this.loading = true
      setTimeout(() => {
        this.data = []
        this.loading = false
      }, 100)
      this.savetable.length = 0
    },
    clearallbuildinglineandgrade () {
      this.loading = true
      setTimeout(() => {
        this.bldglgdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'bldglg') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearalloccupancylineandgrade () {
      this.loading = true
      setTimeout(() => {
        this.occlgdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'occlg') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallbuildingarchitecture () {
      this.loading = true
      setTimeout(() => {
        this.bldgarchdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'bldgarch') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearalloccupancyarchitecture () {
      this.loading = true
      setTimeout(() => {
        this.occarchdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'occarch') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallbuildingstructural () {
      this.loading = true
      setTimeout(() => {
        this.bldgstructdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'bldgstruct') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearalloccupancystructural () {
      this.loading = true
      setTimeout(() => {
        this.occstructdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'occstruct') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallbuildingplumbing () {
      this.loading = true
      setTimeout(() => {
        this.bldgplumdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'bldgplum') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearalloccupancyplumbing () {
      this.loading = true
      setTimeout(() => {
        this.occplumdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'occplum') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallbuildingelectrical () {
      this.loading = true
      setTimeout(() => {
        this.bldgelecdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'bldgelec') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearalloccupancyelectrical () {
      this.loading = true
      setTimeout(() => {
        this.occelecdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'occelec') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallbuildingmechanical () {
      this.loading = true
      setTimeout(() => {
        this.bldgmechdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'bldgmech') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearalloccupancymechanical () {
      this.loading = true
      setTimeout(() => {
        this.occmechdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'occmech') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallsignage () {
      this.loading = true
      setTimeout(() => {
        this.signdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'signage') {
          this.savetable.splice(i, 1)
        }
      }
      this.signageallowadd = true
    },
    clearallelectrical () {
      this.loading = true
      setTimeout(() => {
        this.elecdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'electrical') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallmechanical () {
      this.loading = true
      setTimeout(() => {
        this.mechdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'mechanical') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallzoning () {
      this.loading = true
      setTimeout(() => {
        this.zoningdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'zoning') {
          this.savetable.splice(i, 1)
        }
      }
    },
    clearallbfp () {
      this.loading = true
      setTimeout(() => {
        this.bfpdata = []
        this.loading = false
      }, 100)
      for (var i = 0; i < this.savetable.length; i++) {
        if (this.savetable[i] === 'bfp') {
          this.savetable.splice(i, 1)
        }
      }
    },
    addFinder () {
      this.data.push({
        name: this.sdescription,
        datestarted: this.sdatestart,
        dateended: this.sdateend
      })
      this.addrow = false
    },
    addBuildingLG () {
      if (this.sdescription !== '') {
        this.bldglgdata.push({
          name: this.sdescription
        })
        this.addbuildinglineandgrade = false
        this.sdescription = ''
        if (this.savetable.includes('bldglg') === false) {
          this.savetable.push('bldglg')
        }
      }
    },
    addOccupancyLG () {
      this.occlgdata.push({
        name: this.sdescription
      })
      this.addoccupancylineandgrade = false
      this.sdescription = ''
      if (this.savetable.includes('occlg') === false) {
        this.savetable.push('occlg')
      }
    },
    addBuildingArch () {
      this.bldgarchdata.push({
        name: this.sdescription
      })
      this.addbuildingarchitecture = false
      this.sdescription = ''
      if (this.savetable.includes('bldgarch') === false) {
        this.savetable.push('bldgarch')
      }
    },
    addOccupancyArch () {
      this.occarchdata.push({
        name: this.sdescription
      })
      this.addoccupancyarchitecture = false
      this.sdescription = ''
      if (this.savetable.includes('occarch') === false) {
        this.savetable.push('occarch')
      }
    },
    addBuildingStruct () {
      this.bldgstructdata.push({
        name: this.sdescription
      })
      this.addbuildingstructural = false
      this.sdescription = ''
      if (this.savetable.includes('bldgstruct') === false) {
        this.savetable.push('bldgstruct')
      }
    },
    addOccupancyStruct () {
      this.occstructdata.push({
        name: this.sdescription
      })
      this.addoccupancystructural = false
      this.sdescription = ''
      if (this.savetable.includes('occstruct') === false) {
        this.savetable.push('occstruct')
      }
    },
    addBuildingPlum () {
      this.bldgplumdata.push({
        name: this.sdescription
      })
      this.addbuildingplumbing = false
      this.sdescription = ''
      if (this.savetable.includes('bldgplum') === false) {
        this.savetable.push('bldgplum')
      }
    },
    addOccupancyPlum () {
      this.occplumdata.push({
        name: this.sdescription
      })
      this.addoccupancyplumbing = false
      this.sdescription = ''
      if (this.savetable.includes('occplum') === false) {
        this.savetable.push('occplum')
      }
    },
    addBuildingElec () {
      this.bldgelecdata.push({
        name: this.sdescription
      })
      this.addbuildingelectrical = false
      this.sdescription = ''
      if (this.savetable.includes('bldgelec') === false) {
        this.savetable.push('bldgelec')
      }
    },
    addOccupancyElec () {
      this.occelecdata.push({
        name: this.sdescription
      })
      this.addoccupancyelectrical = false
      this.sdescription = ''
      if (this.savetable.includes('occelec') === false) {
        this.savetable.push('occelec')
      }
    },
    addBuildingMech () {
      this.bldgmechdata.push({
        name: this.sdescription
      })
      this.addbuildingmechanical = false
      this.sdescription = ''
      if (this.savetable.includes('bldgmech') === false) {
        this.savetable.push('bldgmech')
      }
    },
    addOccupancyMech () {
      this.occmechdata.push({
        name: this.sdescription
      })
      this.addoccupancymechanical = false
      this.sdescription = ''
      if (this.savetable.includes('occmech') === false) {
        this.savetable.push('occmech')
      }
    },
    addSignage () {
      this.signdata.push({
        name: this.sdescription
      })
      this.addsignagerow = false
      this.sdescription = ''
      if (this.savetable.includes('signage') === false) {
        this.savetable.push('signage')
      }
      this.signageallowadd = false
    },
    addElectrical () {
      this.elecdata.push({
        name: this.sdescription
      })
      this.addelectrical = false
      this.sdescription = ''
      if (this.savetable.includes('electrical') === false) {
        this.savetable.push('electrical')
      }
    },
    addMechanical () {
      this.mechdata.push({
        name: this.sdescription
      })
      this.addmechanical = false
      this.sdescription = ''
      if (this.savetable.includes('mechanical') === false) {
        this.savetable.push('mechanical')
      }
    },
    addZoning () {
      this.zoningdata.push({
        name: this.sdescription
      })
      this.addzoning = false
      this.sdescription = ''
      if (this.savetable.includes('zoning') === false) {
        this.savetable.push('zoning')
      }
    },
    addBFP () {
      this.bfpdata.push({
        name: this.sdescription
      })
      this.addbfp = false
      this.sdescription = ''
      if (this.savetable.includes('bfp') === false) {
        this.savetable.push('bfp')
      }
    },
    loadTables () {
      this.userdefaultaccess = false
      const buildingLGAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('buildinglineandgrade') + '_token')
      const occupancyLGAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('occupancylineandgrade') + '_token')
      const buildingArchAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('buildingarchitecture') + '_token')
      const occupancyArchAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('occupancyarchitecture') + '_token')
      const buildingStructAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('buildingstructural') + '_token')
      const occupancyStructAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('occupancystructural') + '_token')
      const buildingPlumAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('buildingsanitaryplumbing') + '_token')
      const occupancyPlumAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('occupancysanitaryplumbing') + '_token')
      const buildingElecAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('buildingelectrical') + '_token')
      const occupancyElecAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('occupancyelectrical') + '_token')
      const buildingMechAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('buildingmechanical') + '_token')
      const occupancyMechAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('occupancymechanical') + '_token')
      const signageAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('signage') + '_token')
      const electricalAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('electrical') + '_token')
      const mechanicalAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('mechanical') + '_token')
      const zoningAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('zoning') + '_token')
      const bfpAccess = this.$q.sessionStorage.has('__' + l3s.Encrypt('bfp') + '_token')

      if (buildingLGAccess && this.appno.length === 9) {
        this.userbuildinglgaccess = true
      } else {
        this.userbuildinglgaccess = false
      }

      if (occupancyLGAccess && this.appno.length === 8) {
        this.useroccupancylgaccess = true
      } else {
        this.useroccupancylgaccess = false
      }

      if (buildingArchAccess && this.appno.length === 9) {
        this.userbuildingarchaccess = true
      } else {
        this.userbuildingarchaccess = false
      }

      if (occupancyArchAccess && this.appno.length === 8) {
        this.useroccupancyarchaccess = true
      } else {
        this.useroccupancyarchaccess = false
      }

      if (buildingStructAccess && this.appno.length === 9) {
        this.userbuildingstructaccess = true
      } else {
        this.userbuildingstructaccess = false
      }

      if (occupancyStructAccess && this.appno.length === 8) {
        this.useroccupancystructaccess = true
      } else {
        this.useroccupancystructaccess = false
      }

      if (buildingPlumAccess && this.appno.length === 9) {
        this.userbuildingplumaccess = true
      } else {
        this.userbuildingplumaccess = false
      }

      if (occupancyPlumAccess && this.appno.length === 8) {
        this.useroccupancyplumaccess = true
      } else {
        this.useroccupancyplumaccess = false
      }

      if (buildingElecAccess && this.appno.length === 9) {
        this.userbuildingelecaccess = true
      } else {
        this.userbuildingelecaccess = false
      }

      if (occupancyElecAccess && this.appno.length === 8) {
        this.useroccupancyelecaccess = true
      } else {
        this.useroccupancyelecaccess = false
      }

      if (buildingMechAccess && this.appno.length === 9) {
        this.userbuildingmechaccess = true
      } else {
        this.userbuildingmechaccess = false
      }

      if (occupancyMechAccess && this.appno.length === 8) {
        this.useroccupancymechaccess = true
      } else {
        this.useroccupancymechaccess = false
      }

      if (signageAccess && this.appno.length === 11) {
        this.usersignageaccess = true
      } else {
        this.usersignageaccess = false
      }

      if (electricalAccess && this.appno.length === 10) {
        this.userelectricalaccess = true
      } else {
        this.userelectricalaccess = false
      }

      if (mechanicalAccess && this.appno.length === 7) {
        this.usermechanicalaccess = true
      } else {
        this.usermechanicalaccess = false
      }

      if (zoningAccess && this.appno.length > 7 && this.appno.length < 10) {
        this.userzoningaccess = true
      } else {
        this.userzoningaccess = false
      }
      this.$q.loading.hide()

      if (bfpAccess && this.appno.length > 7 && this.appno.length < 10) {
        this.userbfpaccess = true
      } else {
        this.userbfpaccess = false
      }
      this.$q.loading.hide()
    },
    saveData () {
      // this.$q.loading.show({
      //   message: 'Saving Data'
      // })

      // let currentDate = new Date()
      // let hour = currentDate.getHours()
      // let minutes = currentDate.getMinutes()
      // let month = currentDate.getMonth() + 1
      // let day = currentDate.getDate()
      // let year = currentDate.getFullYear()
      // let fulltime = hour + ':' + minutes
      // let fulldate = month + '/' + day + '/' + year

      // let employeenameEncrypted = this.$q.sessionStorage.getItem('__' + l3s.Encrypt('employeename') + '_token')
      // let employeename = l3s.DecryptNetwork(employeenameEncrypted)

      // let empid = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

      // if (this.bldglgdata && this.bldglgdata.length) {

      // } else {
      //   // this.isDataEmpty = true
      //   // this.$q.loading.hide()
      // }

      // if (this.occlgdata && this.occlgdata.length) {
      //   this.isDataEmpty = false
      //   let progressflow = this.occlgdata
      //   let str = ''
      //   for (let i in progressflow) {
      //     if (i < 1) {
      //       str = progressflow[i].name
      //     } else {
      //       str = str + '/' + progressflow[i].name
      //     }
      //   }
      //   this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getProgressFlowID') + '/' + l3s.EncryptNetwork('LINE AND GRADE'))
      //     .then((response) => {
      //       let decrypted = l3s.DecryptNetwork(response.data)
      //       let jsonize = json.parse(decrypted)
      //       let refpfid = jsonize[0].ref_progressflowid

      //       this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy1') + '/' + l3s.EncryptNetwork(refpfid) + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
      //         .then((response) => {
      //           let decrypted = l3s.DecryptNetwork(response.data)
      //           let jsonize = json.parse(decrypted)
      //           let affected = jsonize.affectedRows

      //           if (affected > 0) {
      //             this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getOccupancyPFID') + '/' + l3s.Encrypt('1') + '/' + l3s.Encrypt('2') + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
      //               .then((response) => {
      //                 let decrypted = l3s.DecryptNetwork(response.data)
      //                 let jsonize = json.parse(decrypted)
      //                 let maxPFID = jsonize[0].max

      //                 this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy2') + '/' + l3s.EncryptNetwork(fulldate) + '/' + l3s.EncryptNetwork(fulldate) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
      //                   .then((response) => {
      //                     let decrypted = l3s.DecryptNetwork(response.data)
      //                     let jsonize = json.parse(decrypted)

      //                     if (jsonize.affectedRows > 0) {
      //                       this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy3') + '/' + l3s.EncryptNetwork(empid) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
      //                         .then((response) => {
      //                           let decrypted = l3s.DecryptNetwork(response.data)
      //                           let jsonize = json.parse(decrypted)

      //                           if (jsonize.affectedRows > 0) {
      //                             this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy4') + '/' + l3s.EncryptNetwork(str) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
      //                               .then((response) => {
      //                                 let decrypted = l3s.DecryptNetwork(response.data)
      //                                 let jsonize = json.parse(decrypted)

      //                                 if (jsonize.affectedRows > 0) {
      //                                   // Swal.fire({
      //                                   //   icon: 'success',
      //                                   //   title: 'Successfully Saved'
      //                                   // })
      //                                   this.saveMessage()

      //                                   if (jsonize.affectedRows > 0) {
      //                                     let docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
      //                                     this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowOCC1') + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.EncryptNetwork(docDate) + '/' + l3s.EncryptNetwork('00') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
      //                                       .then((response) => {
      //                                         let decrypted = l3s.DecryptNetwork(response.data)
      //                                         let jsonize = json.parse(decrypted)
      //                                         // console.log(jsonize)
      //                                         Swal.fire({
      //                                           text: jsonize
      //                                         })
      //                                       })
      //                                       .catch((err) => {
      //                                         this.$q.loading.hide()
      //                                         if (err.message === 'Network Error') {
      //                                           Swal.fire({
      //                                             icon: 'error',
      //                                             title: 'Saving Failed',
      //                                             text: 'No Connection on Server'
      //                                           })
      //                                         } else {
      //                                           Swal.fire({
      //                                             icon: 'error',
      //                                             title: 'Saving Failed',
      //                                             text: err.message
      //                                           })
      //                                         }
      //                                       })
      //                                   }
      //                                 } else {
      //                                   Swal.fire({
      //                                     icon: 'error',
      //                                     title: 'Saving Failed',
      //                                     text: jsonize.serverStatus
      //                                   })
      //                                 }
      //                               })
      //                               .catch((err) => {
      //                                 this.$q.loading.hide()
      //                                 if (err.message === 'Network Error') {
      //                                   Swal.fire({
      //                                     icon: 'error',
      //                                     title: 'Saving Failed',
      //                                     text: 'No Connection on Server'
      //                                   })
      //                                 } else {
      //                                   Swal.fire({
      //                                     icon: 'error',
      //                                     title: 'Saving Failed',
      //                                     text: err.message
      //                                   })
      //                                 }
      //                               })
      //                           }
      //                         })
      //                         .catch((err) => {
      //                           this.$q.loading.hide()
      //                           if (err.message === 'Network Error') {
      //                             Swal.fire({
      //                               icon: 'error',
      //                               title: 'Saving Failed',
      //                               text: 'No Connection on Server'
      //                             })
      //                           } else {
      //                             Swal.fire({
      //                               icon: 'error',
      //                               title: 'Saving Failed',
      //                               text: err.message
      //                             })
      //                           }
      //                         })
      //                     }
      //                   })
      //                   .catch((err) => {
      //                     this.$q.loading.hide()
      //                     if (err.message === 'Network Error') {
      //                       Swal.fire({
      //                         icon: 'error',
      //                         title: 'Saving Failed',
      //                         text: 'No Connection on Server'
      //                       })
      //                     } else {
      //                       Swal.fire({
      //                         icon: 'error',
      //                         title: 'Saving Failed',
      //                         text: err.message
      //                       })
      //                     }
      //                   })
      //               })
      //               .catch((err) => {
      //                 this.$q.loading.hide()
      //                 if (err.message === 'Network Error') {
      //                   Swal.fire({
      //                     icon: 'error',
      //                     title: 'Saving Failed',
      //                     text: 'No Connection on Server'
      //                   })
      //                 } else {
      //                   Swal.fire({
      //                     icon: 'error',
      //                     title: 'Saving Failed',
      //                     text: err.message
      //                   })
      //                 }
      //               })
      //           }
      //         })
      //         .catch((err) => {
      //           this.$q.loading.hide()
      //           if (err.message === 'Network Error') {
      //             Swal.fire({
      //               icon: 'error',
      //               title: 'Saving Failed',
      //               text: 'No Connection on Server'
      //             })
      //           } else {
      //             Swal.fire({
      //               icon: 'error',
      //               title: 'Saving Failed',
      //               text: err.message
      //             })
      //           }
      //         })
      //     })
      //     .catch((err) => {
      //       this.$q.loading.hide()
      //       if (err.message === 'Network Error') {
      //         Swal.fire({
      //           icon: 'error',
      //           title: 'Saving Failed',
      //           text: 'No Connection on Server'
      //         })
      //       } else {
      //         Swal.fire({
      //           icon: 'error',
      //           title: 'Saving Failed',
      //           text: err.message
      //         })
      //       }
      //     })
      // } else {
      //   // this.isDataEmpty = true
      //   // this.$q.loading.hide()
      // }

      // if (this.bldgarchdata && this.bldgarchdata.length) {

      // } else {
      //   // this.isDataEmpty = true
      //   // this.$q.loading.hide()
      // }

      // Test
      // for (let i = 0; i < this.savetable.length; i++) {
      //   if (this.savetable[i] === 'bldglg') {
      //     this.saveBldgLG()
      //   } else if (this.savetable[i] === 'bldgarch') {
      //     this.saveBldgArch()
      //   } else if (this.savetable[i] === 'bldgplum') {
      //     console.log('save building plumbing')
      //   }
      // }

      if (this.isDataEmpty === true) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot Save',
          text: 'No Data is Registered'
        })
      }
    },
    refetchData () {
      const refProgressflowList = []
      const actionList = []
      let actionSplit

      this.$axios.get('/api/GetProgressFlow/' + this.appno)
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            // eslint-disable-next-line camelcase
            const ref_progressflowid = response.data[i].ref_progressflowid
            const action = response.data[i].action

            refProgressflowList.push(ref_progressflowid)
            actionList.push(action)
            actionSplit = actionList[i].split('\n')
            const replaced = actionSplit.toString().replace('>', '')
            console.log('actionSplit: ' + replaced)
          }
          /* console.log(refProgressflowList)
          console.log(actionList) */
        })
    },
    saveMessage (progressflow) {
      // if (this.okSaved === true) {
      Swal.fire({
        icon: 'success',
        title: 'SUCCESSFULLY SAVED ' + progressflow + ' FINDINGS'
      })
      // }
    },
    saveBldgLG () {
      const currentDate = new Date()
      const hour = currentDate.getHours()
      const minutes = currentDate.getMinutes()
      const month = currentDate.getMonth() + 1
      const day = currentDate.getDate()
      const year = currentDate.getFullYear()
      const fulltime = hour + ':' + minutes
      const fulldate = month + '/' + day + '/' + year
      const employeenameEncrypted = this.$q.sessionStorage.getItem('__' + l3s.Encrypt('employeename') + '_token')
      const employeename = l3s.DecryptNetwork(employeenameEncrypted)
      const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

      this.isDataEmpty = false
      const progressflow = this.bldglgdata
      const str = ''
      // for (let i in progressflow) {
      //   if (i < 1) {
      //     str = progressflow[i].name
      //   } else {
      //     str = str + '/' + progressflow[i].name
      //   }
      // }
      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getProgressFlowID') + '/LINE AND GRADE')
        .then((response) => {
          const decrypted = l3s.DecryptNetwork(response.data)
          const jsonize = json.parse(decrypted)
          const refpfid = jsonize[0].ref_progressflowid

          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding1') + '/' + (refpfid) + '/' + (this.appno) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
            .then((response) => {
              const decrypted = l3s.DecryptNetwork(response.data)
              const jsonize = json.parse(decrypted)
              const affected = jsonize.affectedRows

              if (affected > 0) {
                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getBuildingPFID') + '/' + ('1'))
                  .then((response) => {
                    const decrypted = l3s.DecryptNetwork(response.data)
                    const jsonize = json.parse(decrypted)
                    const maxPFID = jsonize[0].max

                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding2') + '/' + (fulltime) + '/' + l3s.EncryptNetwork(fulldate) + '/' + (maxPFID) + '/' + ('4') + '/' + ('5'))
                      .then((response) => {
                        const decrypted = l3s.DecryptNetwork(response.data)
                        const jsonize = json.parse(decrypted)

                        if (jsonize.affectedRows > 0) {
                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding3') + '/' + (employeename) + '/' + (maxPFID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                            .then((response) => {
                              const decrypted = l3s.DecryptNetwork(response.data)
                              const jsonize = json.parse(decrypted)

                              for (const i in progressflow) {
                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveProgressFlow') + '/' + (this.appid) + '/' + (refpfid) + '/' + (progressflow[i].name) + '/' + ('4') + '/' + ('5'))
                                  .then((response) => {
                                    // let decrypted = l3s.DecryptNetwork(response.data)
                                    // let jsonize = json.parse(decrypted)
                                    // counter = jsonize.affectedRows
                                  })
                              }

                              if (jsonize.affectedRows > 0) {
                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding4') + '/' + (str) + '/' + (maxPFID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                  .then((response) => {
                                    const decrypted = l3s.DecryptNetwork(response.data)
                                    const jsonize = json.parse(decrypted)

                                    if (jsonize.affectedRows > 0) {
                                      const docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
                                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG1') + '/' + (this.appid) + '/' + l3s.EncryptNetwork(docDate) + '/' + ('00') + '/' + ('4') + '/' + ('5'))
                                        .then((response) => {
                                          const decrypted = l3s.DecryptNetwork(response.data)
                                          const jsonize = json.parse(decrypted)

                                          if (jsonize.affectedRows > 0) {
                                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getDocflowID') + '/' + (this.appid))
                                              .then((response) => {
                                                const decrypted = l3s.DecryptNetwork(response.data)
                                                const jsonize = json.parse(decrypted)
                                                const docID = jsonize[0].max

                                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG2') + '/' + (empid) + '/' + (docID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                                  .then((response) => {
                                                    const decrypted = l3s.DecryptNetwork(response.data)
                                                    const jsonize = json.parse(decrypted)
                                                    // this.$q.loading.hide()

                                                    if (jsonize.affectedRows > 0) {
                                                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG3') + '/' + ('BUILDING LINE AND GRADE INSPECTED') + '/' + (docID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                                        .then((response) => {
                                                          const decrypted = l3s.DecryptNetwork(response.data)
                                                          const jsonize = json.parse(decrypted)
                                                          this.$q.loading.hide()
                                                          if (jsonize.affectedRows > 0) {
                                                            // Swal.fire({
                                                            //   icon: 'success',
                                                            //   title: 'Successfully Saved'
                                                            // })
                                                            this.saveMessage('LINE AND GRADE')
                                                          } else {
                                                            Swal.fire({
                                                              icon: 'error',
                                                              title: 'Saving Failed',
                                                              text: jsonize.serverStatus
                                                            })
                                                          }
                                                        })
                                                        .catch((err) => {
                                                          this.$q.loading.hide()
                                                          if (err.message === 'Network Error') {
                                                            Swal.fire({
                                                              icon: 'error',
                                                              title: 'Saving Failed',
                                                              text: 'No Connection on Server'
                                                            })
                                                          } else {
                                                            Swal.fire({
                                                              icon: 'error',
                                                              title: 'Saving Failed',
                                                              text: err.message
                                                            })
                                                          }
                                                        })
                                                    } else {
                                                      Swal.fire({
                                                        icon: 'error',
                                                        title: 'Saving Failed',
                                                        text: jsonize.serverStatus
                                                      })
                                                    }
                                                  })
                                                  .catch((err) => {
                                                    this.$q.loading.hide()
                                                    if (err.message === 'Network Error') {
                                                      Swal.fire({
                                                        icon: 'error',
                                                        title: 'Saving Failed',
                                                        text: 'No Connection on Server'
                                                      })
                                                    } else {
                                                      Swal.fire({
                                                        icon: 'error',
                                                        title: 'Saving Failed',
                                                        text: err.message
                                                      })
                                                    }
                                                  })
                                              })
                                              .catch((err) => {
                                                this.$q.loading.hide()
                                                if (err.message === 'Network Error') {
                                                  Swal.fire({
                                                    icon: 'error',
                                                    title: 'Saving Failed',
                                                    text: 'No Connection on Server'
                                                  })
                                                } else {
                                                  Swal.fire({
                                                    icon: 'error',
                                                    title: 'Saving Failed',
                                                    text: err.message
                                                  })
                                                }
                                              })
                                          } else {
                                            Swal.fire({
                                              icon: 'error',
                                              title: 'Saving Failed',
                                              text: jsonize.serverStatus
                                            })
                                          }
                                        })
                                        .catch((err) => {
                                          this.$q.loading.hide()
                                          if (err.message === 'Network Error') {
                                            Swal.fire({
                                              icon: 'error',
                                              title: 'Saving Failed',
                                              text: 'No Connection on Server'
                                            })
                                          } else {
                                            Swal.fire({
                                              icon: 'error',
                                              title: 'Saving Failed',
                                              text: err.message
                                            })
                                          }
                                        })
                                    } else {
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Saving Failed',
                                        text: jsonize.serverStatus
                                      })
                                    }
                                  })
                                  .catch((err) => {
                                    this.$q.loading.hide()
                                    if (err.message === 'Network Error') {
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Saving Failed',
                                        text: 'No Connection on Server'
                                      })
                                    } else {
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Saving Failed',
                                        text: err.message
                                      })
                                    }
                                  })
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Saving Failed',
                                  text: response.message
                                })
                              }
                            })
                            .catch((err) => {
                              this.$q.loading.hide()
                              if (err.message === 'Network Error') {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Saving Failed',
                                  text: 'No Connection on Server'
                                })
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Saving Failed',
                                  text: err.message
                                })
                              }
                            })
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Saving Failed',
                            text: response.message
                          })
                          // Delete Status
                        }
                      })
                  })
                  .catch((err) => {
                    this.$q.loading.hide()
                    if (err.message === 'Network Error') {
                      Swal.fire({
                        icon: 'error',
                        title: 'Saving Failed',
                        text: 'No Connection on Server'
                      })
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Saving Failed',
                        text: err.message
                      })
                    }
                  })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Saving Failed',
                  text: response.message
                })
              }
            })
            .catch((err) => {
              this.$q.loading.hide()
              if (err.message === 'Network Error') {
                Swal.fire({
                  icon: 'error',
                  title: 'Saving Failed',
                  text: 'No Connection on Server'
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Saving Failed',
                  text: err.message
                })
              }
            })
        })
        .catch((err) => {
          this.$q.loading.hide()
          if (err.message === 'Network Error') {
            Swal.fire({
              icon: 'error',
              title: 'Saving Failed',
              text: 'No Connection on Server'
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Saving Failed',
              text: err.message
            })
          }
        })

      this.userbuildinglgaccess = false
    },
    saveBldgArch () {
      const currentDate = new Date()
      const hour = currentDate.getHours()
      const minutes = currentDate.getMinutes()
      const month = currentDate.getMonth() + 1
      const day = currentDate.getDate()
      const year = currentDate.getFullYear()
      const fulltime = hour + ':' + minutes
      const fulldate = month + '/' + day + '/' + year
      const employeenameEncrypted = this.$q.sessionStorage.getItem('__' + l3s.Encrypt('employeename') + '_token')
      const employeename = l3s.DecryptNetwork(employeenameEncrypted)
      const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

      this.isDataEmpty = false
      const progressflow = this.bldgarchdata
      const str = ''
      // for (let i in progressflow) {
      //   if (i < 1) {
      //     str = progressflow[i].name
      //   } else {
      //     str = str + '/' + progressflow[i].name
      //   }
      // }
      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getProgressFlowID') + '/ARCHITECTURAL')
        .then((response) => {
          const decrypted = l3s.DecryptNetwork(response.data)
          const jsonize = json.parse(decrypted)
          const refpfid = jsonize[0].ref_progressflowid

          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding1') + '/' + (refpfid) + '/' + (this.appno) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
            .then((response) => {
              const decrypted = l3s.DecryptNetwork(response.data)
              const jsonize = json.parse(decrypted)
              const affected = jsonize.affectedRows

              if (affected > 0) {
                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getBuildingPFID') + '/' + ('1'))
                  .then((response) => {
                    const decrypted = l3s.DecryptNetwork(response.data)
                    const jsonize = json.parse(decrypted)
                    const maxPFID = jsonize[0].max

                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding2') + '/' + (fulltime) + '/' + (fulldate) + '/' + (maxPFID) + '/' + ('4') + '/' + ('5'))
                      .then((response) => {
                        const decrypted = l3s.DecryptNetwork(response.data)
                        const jsonize = json.parse(decrypted)

                        if (jsonize.affectedRows > 0) {
                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding3') + '/' + (employeename) + '/' + (maxPFID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                            .then((response) => {
                              // let decrypted = l3s.DecryptNetwork(response.data)
                              // let jsonize = json.parse(decrypted)
                              // let counter = jsonize

                              for (const i in progressflow) {
                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveProgressFlow') + '/' + (this.appid) + '/' + (refpfid) + '/' + (progressflow[i].name) + '/' + ('4') + '/' + ('5'))
                                  .then((response) => {
                                    // let decrypted = l3s.DecryptNetwork(response.data)
                                    // let jsonize = json.parse(decrypted)
                                    // counter = jsonize.affectedRows
                                  })
                              }

                              // here
                              this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding4') + '/' + (str) + '/' + (maxPFID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                .then((response) => {
                                  const decrypted = l3s.DecryptNetwork(response.data)
                                  const jsonize = json.parse(decrypted)

                                  if (jsonize.affectedRows > 0) {
                                    const docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
                                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG1') + '/' + (this.appid) + '/' + (docDate) + '/' + ('00') + '/' + ('4') + '/' + ('5'))
                                      .then((response) => {
                                        const decrypted = l3s.DecryptNetwork(response.data)
                                        const jsonize = json.parse(decrypted)

                                        if (jsonize.affectedRows > 0) {
                                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getDocflowID') + '/' + (this.appid))
                                            .then((response) => {
                                              const decrypted = l3s.DecryptNetwork(response.data)
                                              const jsonize = json.parse(decrypted)
                                              const docID = jsonize[0].max

                                              this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG2') + '/' + (empid) + '/' + (docID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                                .then((response) => {
                                                  const decrypted = l3s.DecryptNetwork(response.data)
                                                  const jsonize = json.parse(decrypted)
                                                  // this.$q.loading.hide()

                                                  if (jsonize.affectedRows > 0) {
                                                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG3') + '/' + ('BUILDING ARCHITECTURE INSPECTED') + '/' + (docID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                                      .then((response) => {
                                                        const decrypted = l3s.DecryptNetwork(response.data)
                                                        const jsonize = json.parse(decrypted)
                                                        this.$q.loading.hide()
                                                        if (jsonize.affectedRows > 0) {
                                                          // Swal.fire({
                                                          //   icon: 'success',
                                                          //   title: 'Successfully Saved'
                                                          // })
                                                          this.saveMessage('ARCHITECTURAL')
                                                        } else {
                                                          Swal.fire({
                                                            icon: 'error',
                                                            title: 'Saving Failed',
                                                            text: jsonize.serverStatus
                                                          })
                                                        }
                                                      })
                                                  } else {
                                                    Swal.fire({
                                                      icon: 'error',
                                                      title: 'Saving Failed',
                                                      text: jsonize.serverStatus
                                                    })
                                                    // Delete Status
                                                  }
                                                })
                                                .catch((err) => {
                                                  this.$q.loading.hide()
                                                  if (err.message === 'Network Error') {
                                                    Swal.fire({
                                                      icon: 'error',
                                                      title: 'Saving Failed',
                                                      text: 'No Connection on Server'
                                                    })
                                                  } else {
                                                    Swal.fire({
                                                      icon: 'error',
                                                      title: 'Saving Failed',
                                                      text: err.message
                                                    })
                                                  }
                                                })
                                            })
                                            .catch((err) => {
                                              this.$q.loading.hide()
                                              if (err.message === 'Network Error') {
                                                Swal.fire({
                                                  icon: 'error',
                                                  title: 'Saving Failed',
                                                  text: 'No Connection on Server'
                                                })
                                              } else {
                                                Swal.fire({
                                                  icon: 'error',
                                                  title: 'Saving Failed',
                                                  text: err.message
                                                })
                                              }
                                            })
                                        }
                                      })
                                      .catch((err) => {
                                        this.$q.loading.hide()
                                        if (err.message === 'Network Error') {
                                          Swal.fire({
                                            icon: 'error',
                                            title: 'Saving Failed',
                                            text: 'No Connection on Server'
                                          })
                                        } else {
                                          Swal.fire({
                                            icon: 'error',
                                            title: 'Saving Failed',
                                            text: err.message
                                          })
                                        }
                                      })
                                  }
                                })
                                .catch((err) => {
                                  this.$q.loading.hide()
                                  if (err.message === 'Network Error') {
                                    Swal.fire({
                                      icon: 'error',
                                      title: 'Saving Failed',
                                      text: 'No Connection on Server'
                                    })
                                  } else {
                                    Swal.fire({
                                      icon: 'error',
                                      title: 'Saving Failed',
                                      text: err.message
                                    })
                                  }
                                })
                            })
                            .catch((err) => {
                              this.$q.loading.hide()
                              if (err.message === 'Network Error') {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Saving Failed',
                                  text: 'No Connection on Server'
                                })
                              } else {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Saving Failed',
                                  text: err.message
                                })
                              }
                            })
                        }
                      })
                  })
                  .catch((err) => {
                    this.$q.loading.hide()
                    if (err.message === 'Network Error') {
                      Swal.fire({
                        icon: 'error',
                        title: 'Saving Failed',
                        text: 'No Connection on Server'
                      })
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Saving Failed',
                        text: err.message
                      })
                    }
                  })
              }
            })
            .catch((err) => {
              this.$q.loading.hide()
              if (err.message === 'Network Error') {
                Swal.fire({
                  icon: 'error',
                  title: 'Saving Failed',
                  text: 'No Connection on Server'
                })
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Saving Failed',
                  text: err.message
                })
              }
            })
        })

      this.userbuildingarchaccess = false
    },
    saveBuilding (progressflowtable, progressflow) {
      if (progressflowtable.length > 0) {
        this.$q.loading.show({
          message: 'SAVING DATA FOR ' + progressflow
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        const fulldate = month + '/' + day + '/' + year
        const employeenameEncrypted = this.$q.sessionStorage.getItem('__' + l3s.Encrypt('employeename') + '_token')
        const employeename = l3s.DecryptNetwork(employeenameEncrypted)
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        this.isDataEmpty = false
        const str = ''

        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getProgressFlowID') + '/' + (progressflow))
          .then((response) => {
            const decrypted = l3s.DecryptNetwork(response.data)
            const jsonize = json.parse(decrypted)
            const refpfid = jsonize[0].ref_progressflowid

            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding1') + '/' + (refpfid) + '/' + (this.appno) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
              .then((response) => {
                const decrypted = l3s.DecryptNetwork(response.data)
                const jsonize = json.parse(decrypted)
                const affected = jsonize.affectedRows

                if (affected > 0) {
                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getBuildingPFID') + '/' + ('1'))
                    .then((response) => {
                      const decrypted = l3s.DecryptNetwork(response.data)
                      const jsonize = json.parse(decrypted)
                      const maxPFID = jsonize[0].max

                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding2') + '/' + (fulltime) + '/' + l3s.EncryptNetwork(fulldate) + '/' + (maxPFID) + '/' + ('4') + '/' + ('5'))
                        .then((response) => {
                          const decrypted = l3s.DecryptNetwork(response.data)
                          const jsonize = json.parse(decrypted)

                          if (jsonize.affectedRows > 0) {
                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding3') + '/' + (employeename) + '/' + (maxPFID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                              .then((response) => {
                                for (const i in progressflowtable) {
                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveProgressFlow') + '/' + (this.appid) + '/' + (refpfid) + '/' + (progressflowtable[i].name) + '/' + ('4') + '/' + ('5'))
                                }

                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveBuilding4') + '/' + l3s.EncryptNetwork(str) + '/' + (maxPFID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                  .then((response) => {
                                    const decrypted = l3s.DecryptNetwork(response.data)
                                    const jsonize = json.parse(decrypted)

                                    if (jsonize.affectedRows > 0) {
                                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getWhereAbout') + '/' + ('BLDGINSPECTED'))
                                        .then((response) => {
                                          const decrypted = l3s.DecryptNetwork(response.data)
                                          const jsonize = json.parse(decrypted)
                                          const whereabouts = jsonize[0].whereabouts
                                          const tagcode = jsonize[0].tagcode
                                          const index = whereabouts.indexOf(' ')
                                          const whereabouts1 = whereabouts.substr(0, index)
                                          const whereabouts2 = whereabouts.substr(index + 1)

                                          const docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
                                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG1') + '/' + (this.appid) + '/' + (docDate) + '/' + ('00') + '/' + ('4') + '/' + ('5'))
                                            .then((response) => {
                                              const decrypted = l3s.DecryptNetwork(response.data)
                                              const jsonize = json.parse(decrypted)

                                              if (jsonize.affectedRows > 0) {
                                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getDocflowID') + '/' + (this.appid))
                                                  .then((response) => {
                                                    const decrypted = l3s.DecryptNetwork(response.data)
                                                    const jsonize = json.parse(decrypted)
                                                    const docID = jsonize[0].max

                                                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG2') + '/' + (empid) + '/' + (docID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                                      .then((response) => {
                                                        const decrypted = l3s.DecryptNetwork(response.data)
                                                        const jsonize = json.parse(decrypted)
                                                        let nprogressflow
                                                        if (progressflow.includes('/')) {
                                                          nprogressflow = progressflow.replace('/', '(') + ')'
                                                        } else {
                                                          nprogressflow = progressflow
                                                        }

                                                        if (jsonize.affectedRows > 0) {
                                                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG3') + '/' + tagcode + '/' + docID + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                                            .then((response) => {
                                                              const decrypted = l3s.DecryptNetwork(response.data)
                                                              const jsonize = json.parse(decrypted)

                                                              if (jsonize.affectedRows > 0) {
                                                                // this.saveMessage(progressflow)
                                                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowBLDG4') + '/' + (whereabouts1 + ' ' + nprogressflow + ' ' + whereabouts2) + '/' + (docID) + '/' + ('3') + '/' + ('4') + '/' + ('5'))
                                                                  .then((response) => {
                                                                    const decrypted = l3s.DecryptNetwork(response.data)
                                                                    const jsonize = json.parse(decrypted)

                                                                    if (jsonize.affectedRows > 0) {
                                                                      this.$q.loading.hide()
                                                                      this.saveMessage(progressflow)
                                                                    } else {
                                                                      Swal.fire({
                                                                        icon: 'error',
                                                                        title: 'Saving Failed',
                                                                        text: jsonize.serverStatus
                                                                      })
                                                                    }
                                                                  })
                                                                  .catch((err) => {
                                                                    this.$q.loading.hide()
                                                                    this.errorMessage(err)
                                                                  })
                                                              } else {
                                                                Swal.fire({
                                                                  icon: 'error',
                                                                  title: 'Saving Failed',
                                                                  text: jsonize.serverStatus
                                                                })
                                                              }
                                                            })
                                                        } else {
                                                          this.$q.loading.hide()
                                                          Swal.fire({
                                                            icon: 'error',
                                                            title: 'Saving Failed',
                                                            text: response.message
                                                          })
                                                        }
                                                      })
                                                      .catch((err) => {
                                                        this.$q.loading.hide()
                                                        this.errorMessage(err)
                                                      })
                                                  })
                                                  .catch((err) => {
                                                    this.$q.loading.hide()
                                                    this.errorMessage(err)
                                                  })
                                              } else {
                                                Swal.fire({
                                                  icon: 'error',
                                                  title: 'Saving Failed',
                                                  text: response.message
                                                })
                                              }
                                            })
                                            .catch((err) => {
                                              this.$q.loading.hide()
                                              this.errorMessage(err)
                                            })
                                        })
                                        .catch((err) => {
                                          this.$q.loading.hide()
                                          this.errorMessage(err)
                                        })
                                    } else {
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Saving Failed',
                                        text: response.message
                                      })
                                    }
                                  })
                                  .catch((err) => {
                                    this.$q.loading.hide()
                                    this.errorMessage(err)
                                  })
                              })
                              .catch((err) => {
                                this.$q.loading.hide()
                                this.errorMessage(err)
                              })
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Saving Failed',
                              text: response.message
                            })
                          }
                        })
                        .catch((err) => {
                          this.$q.loading.hide()
                          this.errorMessage(err)
                        })
                    })
                    .catch((err) => {
                      this.$q.loading.hide()
                      this.errorMessage(err)
                    })
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Saving Failed',
                    text: response.message
                  })
                }
              })
              .catch((err) => {
                this.$q.loading.hide()
                this.errorMessage(err)
              })
          })
          .catch((err) => {
            this.$q.loading.hide()
            this.errorMessage(err)
          })

        if (progressflow.includes('LINE AND GRADE')) {
          this.userbuildinglgaccess = false
        } else if (progressflow.includes('ARCHI')) {
          this.userbuildingarchaccess = false
        } else if (progressflow.includes('STRUCTURAL')) {
          this.userbuildingstructaccess = false
        } else if (progressflow.includes('PLUMBING')) {
          this.userbuildingplumaccess = false
        } else if (progressflow.includes('ARCHI')) {
          this.userbuildingarchaccess = false
        } else if (progressflow.includes('ELECTR')) {
          this.userbuildingelecaccess = false
        } else if (progressflow.includes('MECH')) {
          this.userbuildingmechaccess = false
        } else if (progressflow.includes('ZONING')) {
          this.userzoningaccess = false
        } else if (progressflow.includes('BFP')) {
          this.userbfpaccess = false
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'FINDINGS FOR ' + progressflow + ' IS EMPTY',
          width: '75%'
        })
      }
    },
    async saveBuilding2 (progressflowtable, progressflow) {
      if (progressflowtable.length > 0) {
        if (this.selectedType.includes('Please')) {
          Swal.fire({
            icon: 'error',
            title: 'PLEASE SELECT A TYPE FOR CONSTRUCTION',
            width: '75%'
          })
          this.savedType = null
          return
        } else {
          this.savedType = this.selectedType
        }

        this.$q.loading.show({
          message: 'SAVING DATA FOR BUILDING ' + progressflow
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        const fulldate = month + '/' + day + '/' + year
        const employeenameEncrypted = this.$q.sessionStorage.getItem('__' + l3s.Encrypt('employeename') + '_token')
        const employeename = l3s.DecryptNetwork(employeenameEncrypted)
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        this.isDataEmpty = false
        let str = ''

        for (const i in progressflowtable) {
          str = progressflowtable[i].name

          const allData = l3s.EncryptNetwork(progressflow + '-' + fulltime + '-' + fulldate + '-' + employeename + '-' + empid + '-' + str)
          this.$q.localStorage.remove('__' + l3s.Encrypt('saveBuilding' + progressflow + i) + '_token')
          this.$q.localStorage.set('__' + l3s.Encrypt('saveBuilding' + progressflow + i) + '_token', allData)
        }

        this.$q.loading.hide()
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'SUCCESSFULLY SAVED ' + progressflow
        })

        if (progressflow.includes('LINE AND GRADE')) {
          this.userbuildinglgaccess = false
        } else if (progressflow.includes('ARCHI')) {
          this.userbuildingarchaccess = false
        } else if (progressflow.includes('STRUCTURAL')) {
          this.userbuildingstructaccess = false
        } else if (progressflow.includes('PLUMBING')) {
          this.userbuildingplumaccess = false
        } else if (progressflow.includes('ELECTR')) {
          this.userbuildingelecaccess = false
        } else if (progressflow.includes('MECH')) {
          this.userbuildingmechaccess = false
        } else if (progressflow.includes('ZONING')) {
          this.userzoningaccess = false
        } else if (progressflow.includes('BFP')) {
          this.userbfpaccess = false
        }

        if (this.$q.localStorage.has('__' + l3s.Encrypt('saveBuilding' + progressflow + 0) + '_token')) {
          /* for (const i in progressflowtable) {
            str = progressflowtable[i].name
            await this.saveToDatabase(progressflow, fulltime, fulldate, employeename, empid, str, year, month, day, empid)
          } */
          if (progressflowtable.length > 1) {
            let pftString = ''
            str = progressflowtable[0].name + '\n'
            await this.saveToDatabaseFirst(progressflow, fulltime, fulldate, employeename, empid, str)

            for (let i = 0; i < progressflowtable.length - 1; i++) {
              const j = i + 1
              pftString = pftString + '> ' + progressflowtable[j].name + '\n'
            }
            await this.saveToDatabaseMultiple(progressflow, str + pftString)
          } else {
            str = progressflowtable[0].name
            await this.saveToDatabase2(progressflow, fulltime, fulldate, employeename, empid, str)
          }
        }

        let saved
        if (progressflow.includes('LINE AND GRADE')) {
          saved = await this.savedbldgLG
        } else if (progressflow.includes('ARCHI')) {
          saved = await this.savedbldgArch
        } else if (progressflow.includes('STRUCTURAL')) {
          saved = await this.savedbldgStruct
        } else if (progressflow.includes('PLUMBING')) {
          saved = await this.savedbldgPlum
        } else if (progressflow.includes('ELECTR')) {
          saved = await this.savedbldgElec
        } else if (progressflow.includes('MECH')) {
          saved = await this.savedbldgMech
        } else if (progressflow.includes('ZONING')) {
          saved = await this.savedbldgZoning
        } else if (progressflow.includes('BFP')) {
          saved = await this.savedbldgBFP
        }

        if (saved === 2) {
          this.$axios.get('/api/GetWhereAbout' + '/' + ('BLDGINSPECTED'))
            .then((response) => {
              const whereabouts = response.data[0].whereabouts
              const index = whereabouts.indexOf(' ')
              const whereabouts1 = whereabouts.substr(0, index)
              const whereabouts2 = whereabouts.substr(index + 1)
              let nprogressflow
              if (progressflow.includes('/')) {
                nprogressflow = progressflow.replace('/', '(') + ')'
              } else {
                nprogressflow = progressflow
              }

              return this.$axios.post('/api/UpdateDocflow', {
                receivingid: this.appid,
                datetransac: year + '-' + month + '-' + day + ' ' + fulltime + ':00',
                employeeid: empid,
                remarks: whereabouts1 + ' ' + nprogressflow + ' ' + whereabouts2
              })
            })
            .then(() => {
              return this.$axios.put('/api/UpdateReceiving/' + this.appid, {
                typeofconstruction: this.selectedType
              })
            })
        }

        // if (this.$q.localStorage.has('__' + l3s.Encrypt('saveBuilding' + progressflow) + '_token')) {
        //   this.saveToDatabase(progressflow, fulltime, fulldate, employeename, empid, str)
        // } else {
        //   this.saveBuilding2(progressflowtable, progressflow)
        // }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'FINDINGS FOR ' + progressflow + ' IS EMPTY',
          width: '75%'
        })
      }
    },
    saveOccupancy (progressflowtable, progressflow) {
      if (progressflowtable.length > 0) {
        this.$q.loading.show({
          message: 'SAVING DATA FOR OCCUPANCY ' + progressflow
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        const fulldate = month + '/' + day + '/' + year
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        const str = ''

        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getProgressFlowID') + '/' + l3s.EncryptNetwork(progressflow))
          .then((response) => {
            const decrypted = l3s.DecryptNetwork(response.data)
            const jsonize = json.parse(decrypted)
            const refpfid = jsonize[0].ref_progressflowid

            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy1') + '/' + l3s.EncryptNetwork(refpfid) + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
              .then((response) => {
                const decrypted = l3s.DecryptNetwork(response.data)
                const jsonize = json.parse(decrypted)
                const affected = jsonize.affectedRows

                if (affected > 0) {
                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getOccupancyPFID') + '/' + l3s.Encrypt('1') + '/' + l3s.Encrypt('2') + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                    .then((response) => {
                      const decrypted = l3s.DecryptNetwork(response.data)
                      const jsonize = json.parse(decrypted)
                      const maxPFID = jsonize[0].max

                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy2') + '/' + l3s.EncryptNetwork(fulldate) + '/' + l3s.EncryptNetwork(fulldate) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                        .then((response) => {
                          const decrypted = l3s.DecryptNetwork(response.data)
                          const jsonize = json.parse(decrypted)

                          if (jsonize.affectedRows > 0) {
                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy3') + '/' + l3s.EncryptNetwork(empid) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                              .then((response) => {
                                const decrypted = l3s.DecryptNetwork(response.data)
                                const jsonize = json.parse(decrypted)

                                for (const i in progressflowtable) {
                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancyProgressFlow') + '/' + l3s.EncryptNetwork(this.appid) + '/' + (refpfid) + '/' + (progressflowtable[i].name) + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                }

                                if (jsonize.affectedRows > 0) {
                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveOccupancy4') + '/' + l3s.EncryptNetwork(str) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                    .then((response) => {
                                      const decrypted = l3s.DecryptNetwork(response.data)
                                      const jsonize = json.parse(decrypted)

                                      if (jsonize.affectedRows > 0) {
                                        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getWhereAbout') + '/' + l3s.EncryptNetwork('OCCINSPECTED'))
                                          .then((response) => {
                                            const decrypted = l3s.DecryptNetwork(response.data)
                                            const jsonize = json.parse(decrypted)
                                            const whereabouts = jsonize[0].whereabouts
                                            const tagcode = jsonize[0].tagcode
                                            const index = whereabouts.indexOf(' ')
                                            const whereabouts1 = whereabouts.substr(0, index)
                                            const whereabouts2 = whereabouts.substr(index + 1)

                                            const docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
                                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowOCC1') + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.EncryptNetwork(docDate) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                              .then((response) => {
                                                const decrypted = l3s.DecryptNetwork(response.data)
                                                const jsonize = json.parse(decrypted)

                                                if (jsonize.affectedRows > 0) {
                                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getOccDocflowID') + '/' + l3s.EncryptNetwork(this.appid))
                                                    .then((response) => {
                                                      const decrypted = l3s.DecryptNetwork(response.data)
                                                      const jsonize = json.parse(decrypted)
                                                      const docID = jsonize[0].max

                                                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowOCC2') + '/' + l3s.EncryptNetwork(empid) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                        .then((response) => {
                                                          const decrypted = l3s.DecryptNetwork(response.data)
                                                          const jsonize = json.parse(decrypted)
                                                          let nprogressflow
                                                          if (progressflow.includes('/')) {
                                                            nprogressflow = progressflow.replace('/', '(') + ')'
                                                          } else {
                                                            nprogressflow = progressflow
                                                          }

                                                          if (jsonize.affectedRows > 0) {
                                                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowOCC3-1') + '/' + tagcode + '/' + docID + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                              .then((response) => {
                                                                const decrypted = l3s.DecryptNetwork(response.data)
                                                                const jsonize = json.parse(decrypted)

                                                                if (jsonize.affectedRows > 0) {
                                                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowOCC4') + '/' + (whereabouts1 + ' ' + nprogressflow + ' ' + whereabouts2) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                                    .then((response) => {
                                                                      const decrypted = l3s.DecryptNetwork(response.data)
                                                                      const jsonize = json.parse(decrypted)
                                                                      this.$q.loading.hide()

                                                                      if (jsonize.affectedRows > 0) {
                                                                        this.saveMessage(progressflow)
                                                                      } else {
                                                                        Swal.fire({
                                                                          icon: 'error',
                                                                          title: 'Saving Failed',
                                                                          text: jsonize.serverStatus
                                                                        })
                                                                      }
                                                                    })
                                                                    .catch((err) => {
                                                                      this.$q.loading.hide()
                                                                      this.errorMessage(err)
                                                                    })
                                                                } else {
                                                                  this.$q.loading.hide()
                                                                  Swal.fire({
                                                                    icon: 'error',
                                                                    title: 'Saving Failed',
                                                                    text: jsonize.serverStatus
                                                                  })
                                                                }
                                                              })
                                                          } else {
                                                            Swal.fire({
                                                              icon: 'error',
                                                              title: 'Saving Failed',
                                                              text: response.message
                                                            })
                                                          }
                                                        })
                                                        .catch((err) => {
                                                          this.$q.loading.hide()
                                                          this.errorMessage(err)
                                                        })
                                                    })
                                                    .catch((err) => {
                                                      this.$q.loading.hide()
                                                      this.errorMessage(err)
                                                    })
                                                } else {
                                                  Swal.fire({
                                                    icon: 'error',
                                                    title: 'Saving Failed',
                                                    text: jsonize.serverStatus
                                                  })
                                                  // Delete Status
                                                }
                                              })
                                              .catch((err) => {
                                                this.$q.loading.hide()
                                                this.errorMessage(err)
                                              })
                                          })
                                          .catch((err) => {
                                            this.$q.loading.hide()
                                            this.errorMessage(err)
                                          })
                                      } else {
                                        Swal.fire({
                                          icon: 'error',
                                          title: 'Saving Failed',
                                          text: response.message
                                        })
                                      }
                                    })
                                    .catch((err) => {
                                      this.$q.loading.hide()
                                      this.errorMessage(err)
                                    })
                                } else {
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Saving Failed',
                                    text: response.message
                                  })
                                }
                              })
                              .catch((err) => {
                                this.$q.loading.hide()
                                this.errorMessage(err)
                              })
                          } else {
                            Swal.fire({
                              icon: 'error',
                              title: 'Saving Failed',
                              text: response.message
                            })
                          }
                        })
                        .catch((err) => {
                          this.$q.loading.hide()
                          this.errorMessage(err)
                        })
                    })
                    .catch((err) => {
                      this.$q.loading.hide()
                      this.errorMessage(err)
                    })
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Saving Failed',
                    text: response.message
                  })
                }
              })
              .catch((err) => {
                this.$q.loading.hide()
                this.errorMessage(err)
              })
          })
          .catch((err) => {
            this.$q.loading.hide()
            this.errorMessage(err)
          })

        if (progressflow.includes('LINE AND GRADE')) {
          this.useroccupancylgaccess = false
        } else if (progressflow.includes('ARCHI')) {
          this.useroccupancyarchaccess = false
        } else if (progressflow.includes('STRUCTURAL')) {
          this.useroccupancystructaccess = false
        } else if (progressflow.includes('PLUMBING')) {
          this.useroccupancyplumaccess = false
        } else if (progressflow.includes('ELECTR')) {
          this.useroccupancyelecaccess = false
        } else if (progressflow.includes('MECH')) {
          this.useroccupancymechaccess = false
        } else if (progressflow.includes('ZONING')) {
          this.userzoningaccess = false
        } else if (progressflow.includes('BFP')) {
          this.userbfpaccess = false
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR ' + progressflow + ' IS EMPTY',
          width: '75%'
        })
      }
    },
    async saveOccupancy2 (progressflowtable, progressflow) {
      if (progressflowtable.length > 0) {
        if (this.selectedType.includes('Please')) {
          Swal.fire({
            icon: 'error',
            title: 'PLEASE SELECT A TYPE FOR CONSTRUCTION',
            width: '75%'
          })
          this.savedType = null
          return
        } else {
          this.savedType = this.selectedType
        }

        this.$q.loading.show({
          message: 'SAVING DATA FOR OCCUPANCY ' + progressflow
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        const fulldate = month + '/' + day + '/' + year
        const employeenameEncrypted = this.$q.sessionStorage.getItem('__' + l3s.Encrypt('employeename') + '_token')
        const employeename = l3s.DecryptNetwork(employeenameEncrypted)
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        let str = ''

        for (const i in progressflowtable) {
          str = progressflowtable[i].name

          const allData = l3s.EncryptNetwork(progressflow + '-' + fulltime + '-' + fulldate + '-' + employeename + '-' + empid + '-' + str)
          this.$q.localStorage.remove('__' + l3s.Encrypt('saveOccupancy' + progressflow + i) + '_token')
          this.$q.localStorage.set('__' + l3s.Encrypt('saveOccupancy' + progressflow + i) + '_token', allData)
        }

        this.$q.loading.hide()
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'SUCCESSFULLY SAVED ' + progressflow
        })

        if (progressflow.includes('LINE AND GRADE')) {
          this.useroccupancylgaccess = false
        } else if (progressflow.includes('ARCHI')) {
          this.useroccupancyarchaccess = false
        } else if (progressflow.includes('STRUCTURAL')) {
          this.useroccupancystructaccess = false
        } else if (progressflow.includes('PLUMBING')) {
          this.useroccupancyplumaccess = false
        } else if (progressflow.includes('ARCHI')) {
          this.useroccupancyarchaccess = false
        } else if (progressflow.includes('ELECTR')) {
          this.useroccupancyelecaccess = false
        } else if (progressflow.includes('MECH')) {
          this.useroccupancymechaccess = false
        } else if (progressflow.includes('ZONING')) {
          this.userzoningaccess = false
        } else if (progressflow.includes('BFP')) {
          this.userbfpaccess = false
        }

        if (this.$q.localStorage.has('__' + l3s.Encrypt('saveOccupancy' + progressflow + 0) + '_token')) {
          /* for (const i in progressflowtable) {
            str = progressflowtable[i].name
            await this.saveToDatabaseOcc(progressflow, fulltime, fulldate, employeename, empid, str, year, month, day)
          } */

          if (progressflowtable.length > 1) {
            let pftString = ''
            str = progressflowtable[0].name
            await this.saveToDatabaseOccFirst(progressflow, fulltime, fulldate, employeename, empid, str, year, month, day)

            for (let i = 0; i < progressflowtable.length - 1; i++) {
              const j = i + 1
              pftString = pftString + '/' + progressflowtable[j].name
            }
            await this.saveToDatabaseOccMulti(progressflow, str + pftString)
          } else {
            str = progressflowtable[0].name
            await this.saveToDatabaseOcc(progressflow, fulltime, fulldate, employeename, empid, str, year, month, day)
          }
        }

        let saved
        if (progressflow.includes('LINE AND GRADE')) {
          saved = await this.savedoccLG
        } else if (progressflow.includes('ARCHI')) {
          saved = await this.savedoccArch
        } else if (progressflow.includes('STRUCTURAL')) {
          saved = await this.savedoccStruct
        } else if (progressflow.includes('PLUMBING')) {
          saved = await this.savedoccPlum
        } else if (progressflow.includes('ELECTR')) {
          saved = await this.savedoccElec
        } else if (progressflow.includes('MECH')) {
          saved = await this.savedoccMech
        } else if (progressflow.includes('ZONING')) {
          saved = await this.savedoccZoning
        } else if (progressflow.includes('BFP')) {
          saved = await this.savedoccBFP
        }

        if (saved === 2) {
          this.$axios.get('/api/GetWhereAbout' + '/' + ('OCCINSPECTED'))
            .then((response) => {
              const whereabouts = response.data[0].whereabouts
              const isTag = response.data[0].tagcode
              const index = whereabouts.indexOf(' ')
              const whereabouts1 = whereabouts.substr(0, index)
              const whereabouts2 = whereabouts.substr(index + 1)
              let nprogressflow
              if (progressflow.includes('/')) {
                nprogressflow = progressflow.replace('/', '(') + ')'
              } else {
                nprogressflow = progressflow
              }

              // ADD TAGWORD TO GETWHEREABOUTS

              /* const data = JSON.stringify({
                occupancyreceivingid: this.appid,
                txndate: year + '-' + month + '-' + day + ' 00:00:00', // '2013-05-30 00:00:00',
                remarks: whereabouts1 + ' ' + nprogressflow + ' ' + whereabouts2,
                is_tag: isTag,
                tagword: 'OCCINSPECTED',
                is_approve: 1,
                employeeid: this.empid
              }) */
              return this.$axios.post('/api/UpdateDocflowOcc', {
                occupancyreceivingid: this.appid,
                txndate: year + '-' + month + '-' + day + ' 00:00:00', // '2013-05-30 00:00:00',
                remarks: whereabouts1 + ' ' + nprogressflow + ' ' + whereabouts2,
                is_tag: isTag,
                tagword: 'OCCINSPECTED',
                is_approve: 1,
                employeeid: this.empid
              })
            })
            .then(() => {
              return this.$axios.put('/api/UpdateOccupancy/' + this.appid, {
                typeofconstruction: this.selectedType
              })
            })
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR ' + progressflow + ' IS EMPTY',
          width: '75%'
        })
      }
    },
    saveSignage () {
      if (this.signdata.length > 0) {
        this.$q.loading.show({
          message: 'SAVING DATA FOR SIGNAGE'
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        // let fulldate = month + '/' + day + '/' + year
        const fulldate = year + '-' + month + '-' + day
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveSignage1') + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.Encrypt('2') + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
          .then((response) => {
            const decrypted = l3s.DecryptNetwork(response.data)
            const jsonize = json.parse(decrypted)

            if (jsonize.affectedRows > 0) {
              this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getSignagePFID') + '/' + l3s.Encrypt('1') + '/' + l3s.Encrypt('2') + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                .then((response) => {
                  const decrypted = l3s.DecryptNetwork(response.data)
                  const jsonize = json.parse(decrypted)
                  const maxPFID = jsonize[0].max

                  const datestarted = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('dateStartSignage') + '_token'))
                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveSignage2') + '/' + l3s.EncryptNetwork(datestarted) + '/' + (fulldate) + '/' + (fulldate) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('5'))
                    .then((response) => {
                      const decrypted = l3s.DecryptNetwork(response.data)
                      const jsonize = json.parse(decrypted)

                      if (jsonize.affectedRows > 0) {
                        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveSignage3') + '/' + (empid) + '/' + (empid) + '/' + (maxPFID) + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                          .then((response) => {
                            // let decrypted = l3s.DecryptNetwork(response.data)
                            // let jsonize = json.parse(decrypted)

                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveSignage4') + '/' + (this.signdata[0].name) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))

                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getWhereAbout') + '/' + l3s.EncryptNetwork('SIGNINSPECTED'))
                              .then((response) => {
                                const decrypted = l3s.DecryptNetwork(response.data)
                                const jsonize = json.parse(decrypted)
                                const whereabouts = jsonize[0].whereabouts
                                const tagcode = jsonize[0].tagcode

                                if (whereabouts !== undefined) {
                                  const docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowSign1') + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.EncryptNetwork(docDate) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                    .then((response) => {
                                      const decrypted = l3s.DecryptNetwork(response.data)
                                      const jsonize = json.parse(decrypted)

                                      if (jsonize.affectedRows > 0) {
                                        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getSignDocflowID') + '/' + l3s.EncryptNetwork(this.appid))
                                          .then((response) => {
                                            const decrypted = l3s.DecryptNetwork(response.data)
                                            const jsonize = json.parse(decrypted)
                                            const docID = jsonize[0].max

                                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowSign2') + '/' + l3s.EncryptNetwork(empid) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                              .then((response) => {
                                                const decrypted = l3s.DecryptNetwork(response.data)
                                                const jsonize = json.parse(decrypted)

                                                if (jsonize.affectedRows > 0) {
                                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowSign3') + '/' + (tagcode) + '/' + (docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                    .then((response) => {
                                                      const decrypted = l3s.DecryptNetwork(response.data)
                                                      const jsonize = json.parse(decrypted)

                                                      if (jsonize.affectedRows > 0) {
                                                        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowSign4') + '/' + (whereabouts) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                          .then((response) => {
                                                            this.$q.loading.hide()
                                                            this.saveMessage('SIGNAGE')
                                                          })
                                                          .catch((err) => {
                                                            this.$q.loading.hide()
                                                            this.errorMessage(err)
                                                          })
                                                      } else {
                                                        this.$q.loading.hide()
                                                        Swal.fire({
                                                          icon: 'error',
                                                          title: 'Saving Failed',
                                                          text: jsonize.serverStatus
                                                        })
                                                      }
                                                    })
                                                    .catch((err) => {
                                                      this.$q.loading.hide()
                                                      this.errorMessage(err)
                                                    })
                                                } else {
                                                  this.$q.loading.hide()
                                                  Swal.fire({
                                                    icon: 'error',
                                                    title: 'Saving Failed',
                                                    text: jsonize.serverStatus
                                                  })
                                                  // Delete Status
                                                }
                                              })
                                              .catch((err) => {
                                                this.$q.loading.hide()
                                                this.errorMessage(err)
                                              })
                                          })
                                          .catch((err) => {
                                            this.$q.loading.hide()
                                            this.errorMessage(err)
                                          })
                                      } else {
                                        this.$q.loading.hide()
                                        Swal.fire({
                                          icon: 'error',
                                          title: 'Saving Failed',
                                          text: response.message
                                        })
                                      }
                                    })
                                    .catch((err) => {
                                      this.$q.loading.hide()
                                      this.errorMessage(err)
                                    })
                                } else {
                                  this.$q.loading.hide()
                                  Swal.fire({
                                    icon: 'error',
                                    title: 'Saving Failed',
                                    text: response.message
                                  })
                                }
                              })
                              .catch((err) => {
                                this.$q.loading.hide()
                                this.errorMessage(err)
                              })
                          })
                          .catch((err) => {
                            this.$q.loading.hide()
                            this.errorMessage(err)
                          })
                      } else {
                        this.$q.loading.hide()
                        Swal.fire({
                          icon: 'error',
                          title: 'Saving Failed',
                          text: response.message
                        })
                      }
                    })
                    .catch((err) => {
                      this.$q.loading.hide()
                      this.errorMessage(err)
                    })
                })
                .catch((err) => {
                  this.$q.loading.hide()
                  this.errorMessage(err)
                })
            } else {
              this.$q.loading.hide()
              Swal.fire({
                icon: 'error',
                title: 'Saving Failed',
                text: response.message
              })
            }
          })
          .catch((err) => {
            this.$q.loading.hide()
            this.errorMessage(err)
          })

        this.usersignageaccess = false
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR SIGNAGE IS EMPTY',
          width: '75%'
        })
      }
    },
    async saveSignage2 () {
      if (this.signdata.length > 0) {
        if (this.selectedType.includes('Please')) {
          Swal.fire({
            icon: 'error',
            title: 'PLEASE SELECT A TYPE FOR CONSTRUCTION',
            width: '75%'
          })
          this.savedType = null
          return
        } else {
          this.savedType = this.selectedType
        }

        this.$q.loading.show({
          message: 'SAVING DATA FOR SIGNAGE'
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        // let fulldate = month + '/' + day + '/' + year
        const fulldate = year + '-' + month + '-' + day
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        let str = ''

        for (const i in this.signdata) {
          str = this.signdata[i].name

          const allData = l3s.EncryptNetwork('sigange-' + fulltime + '-' + fulldate + '-' + empid + '-' + str)
          this.$q.localStorage.remove('__' + l3s.Encrypt('saveSignage' + i) + '_token')
          this.$q.localStorage.set('__' + l3s.Encrypt('saveSignage' + i) + '_token', allData)
        }

        this.$q.loading.hide()
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'SUCCESSFULLY SAVED SIGNAGE FINDINGS'
        })
        this.usersignageaccess = false

        if (this.$q.localStorage.has('__' + l3s.Encrypt('saveSignage' + 0) + '_token')) {
          str = this.signdata[0].name
          await this.saveToDatabaseSign(fulltime, fulldate, empid, str)
        }

        const saved = await this.savedSignage

        if (saved === 2) {
          this.$axios.get('/api/GetWhereAbout' + '/' + ('SIGNINSPECTED'))
            .then((response) => {
              const whereabouts = response.data[0].whereabouts
              const isTag = response.data[0].tagcode

              /* const data = JSON.stringify({
                signageid: this.appid,
                txndate: year + '-' + month + '-' + day + ' 00:00:00',
                remarks: whereabouts,
                is_tag: isTag,
                tagword: 'SIGNINSPECTED',
                is_approve: 1,
                employeeid: this.empid
              }) */
              return this.$axios.post('/api/UpdateDocflowSign', {
                signageid: this.appid,
                txndate: year + '-' + month + '-' + day + ' 00:00:00',
                remarks: whereabouts,
                is_tag: isTag,
                tagword: 'SIGNINSPECTED',
                is_approve: 1,
                employeeid: this.empid
              })
            })
            .then(() => {
              /* const data = JSON.stringify({
                typeofconstruction: this.selectedType
              }) */
              return this.$axios.put('/api/UpdateSignage/' + this.appid, {
                typeofconstruction: this.selectedType
              })
            })
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR SIGNAGE IS EMPTY',
          width: '75%'
        })
      }
    },
    saveElectrical () {
      if (this.elecdata.length > 0) {
        this.$q.loading.show({
          message: 'SAVING DATA FOR ELECTRICAL'
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        // let fulldate = month + '/' + day + '/' + year
        const fulldate = year + '-' + month + '-' + day
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getProgressFlowID') + '/' + l3s.EncryptNetwork('ELECTRICAL'))
          .then((response) => {
            const decrypted = l3s.DecryptNetwork(response.data)
            const jsonize = json.parse(decrypted)
            const refpfid = jsonize[0].ref_progressflowid

            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveElectrical1') + '/' + l3s.EncryptNetwork(refpfid) + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
              .then((response) => {
                const decrypted = l3s.DecryptNetwork(response.data)
                const jsonize = json.parse(decrypted)
                const affected = jsonize.affectedRows

                if (affected > 0) {
                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getElectricalPFID') + '/' + l3s.Encrypt('1') + '/' + l3s.Encrypt('2') + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                    .then((response) => {
                      const decrypted = l3s.DecryptNetwork(response.data)
                      const jsonize = json.parse(decrypted)
                      const maxPFID = jsonize[0].max

                      const datestarted = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('dateStart2') + '_token'))
                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveElectrical2') + '/' + l3s.EncryptNetwork(datestarted) + '/' + l3s.EncryptNetwork(fulldate) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                        .then((response) => {
                          const decrypted = l3s.DecryptNetwork(response.data)
                          const jsonize = json.parse(decrypted)

                          if (jsonize.affectedRows > 0) {
                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveElectrical3') + '/' + l3s.EncryptNetwork(empid) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                              .then((response) => {
                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveElectricalProgressFlow') + '/' + l3s.EncryptNetwork(this.appid) + '/' + (this.elecdata[0].name) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))

                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getWhereAbout') + '/' + l3s.EncryptNetwork('ELECINSPECTED'))
                                  .then((response) => {
                                    const decrypted = l3s.DecryptNetwork(response.data)
                                    const jsonize = json.parse(decrypted)
                                    const whereabouts = jsonize[0].whereabouts
                                    const tagcode = jsonize[0].tagcode

                                    const docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
                                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowElec1') + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.EncryptNetwork(docDate) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                      .then((response) => {
                                        const decrypted = l3s.DecryptNetwork(response.data)
                                        const jsonize = json.parse(decrypted)

                                        if (jsonize.affectedRows > 0) {
                                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getElecDocflowID') + '/' + l3s.EncryptNetwork(this.appid))
                                            .then((response) => {
                                              const decrypted = l3s.DecryptNetwork(response.data)
                                              const jsonize = json.parse(decrypted)
                                              const docID = jsonize[0].max

                                              this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowElec2') + '/' + l3s.EncryptNetwork(empid) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                .then((response) => {
                                                  const decrypted = l3s.DecryptNetwork(response.data)
                                                  const jsonize = json.parse(decrypted)

                                                  if (jsonize.affectedRows > 0) {
                                                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowElec3') + '/' + (tagcode) + '/' + (docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                      .then((response) => {
                                                        const decrypted = l3s.DecryptNetwork(response.data)
                                                        const jsonize = json.parse(decrypted)

                                                        if (jsonize.affectedRows > 0) {
                                                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowElec4') + '/' + (whereabouts) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                            .then((response) => {
                                                              this.$q.loading.hide()
                                                              this.saveMessage('ELECTRICAL')
                                                            })
                                                            .catch((err) => {
                                                              this.$q.loading.hide()
                                                              this.errorMessage(err)
                                                            })
                                                        } else {
                                                          this.$q.loading.hide()
                                                          Swal.fire({
                                                            icon: 'error',
                                                            title: 'Saving Failed',
                                                            text: jsonize.serverStatus
                                                          })
                                                        }
                                                      })
                                                      .catch((err) => {
                                                        this.$q.loading.hide()
                                                        this.errorMessage(err)
                                                      })
                                                  } else {
                                                    this.$q.loading.hide()
                                                    Swal.fire({
                                                      icon: 'error',
                                                      title: 'Saving Failed',
                                                      text: jsonize.serverStatus
                                                    })
                                                    // Delete Status
                                                  }
                                                })
                                                .catch((err) => {
                                                  this.$q.loading.hide()
                                                  this.errorMessage(err)
                                                })
                                            })
                                            .catch((err) => {
                                              this.$q.loading.hide()
                                              this.errorMessage(err)
                                            })
                                        } else {
                                          this.$q.loading.hide()
                                          Swal.fire({
                                            icon: 'error',
                                            title: 'Saving Failed',
                                            text: response.message
                                          })
                                        }
                                      })
                                      .catch((err) => {
                                        this.$q.loading.hide()
                                        this.errorMessage(err)
                                      })
                                  })
                                  .catch((err) => {
                                    this.$q.loading.hide()
                                    this.errorMessage(err)
                                  })
                              })
                          } else {
                            this.$q.loading.hide()
                            Swal.fire({
                              icon: 'error',
                              title: 'Saving Failed',
                              text: response.message
                            })
                          }
                        })
                        .catch((err) => {
                          this.$q.loading.hide()
                          this.errorMessage(err)
                        })
                    })
                } else {
                  this.$q.loading.hide()
                  Swal.fire({
                    icon: 'error',
                    title: 'Saving Failed',
                    text: response.message
                  })
                }
              })
              .catch((err) => {
                this.$q.loading.hide()
                this.errorMessage(err)
              })
          })
          .catch((err) => {
            this.$q.loading.hide()
            this.errorMessage(err)
          })

        this.userelectricalaccess = false
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR ELECTRICAL IS EMPTY',
          width: '75%'
        })
      }
    },
    async saveElectrical2 () {
      if (this.elecdata.length > 0) {
        if (this.selectedType.includes('Please')) {
          Swal.fire({
            icon: 'error',
            title: 'PLEASE SELECT A TYPE FOR CONSTRUCTION',
            width: '75%'
          })
          this.savedType = null
          return
        } else {
          this.savedType = this.selectedType
        }

        this.$q.loading.show({
          message: 'SAVING DATA FOR ELECTRICAL'
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        // let fulldate = month + '/' + day + '/' + year
        const fulldate = year + '-' + month + '-' + day
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        let str = ''

        for (const i in this.elecdata) {
          str = this.elecdata[i].name

          const allData = l3s.EncryptNetwork(fulltime + '-' + fulldate + '-' + empid + '-' + str)
          this.$q.localStorage.remove('__' + l3s.Encrypt('saveElectrical' + i) + '_token')
          this.$q.localStorage.set('__' + l3s.Encrypt('saveElectrical' + i) + '_token', allData)
        }

        this.$q.loading.hide()
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'SUCCESSFULLY SAVED ELECTRICAL FINDINGS'
        })

        this.userelectricalaccess = false

        if (this.$q.localStorage.has('__' + l3s.Encrypt('saveElectrical' + 0) + '_token')) {
          await this.saveToDatabaseElec(fulltime, fulldate, empid)

          for (const i in this.elecdata) {
            str = this.elecdata[i].name
            await this.saveToDatabaseElecFindings(str)
          }
        }

        const saved = await this.savedElectrical

        if (saved === 2) {
          this.$axios.get('/api/GetWhereAbout' + '/' + ('ELECINSPECTED'))
            .then((response) => {
              const whereabouts = response.data[0].whereabouts
              const isTag = response.data[0].tagcode

              /* const data = JSON.stringify({
                electricalid: this.appid,
                txndate: year + '-' + month + '-' + day + ' 00:00:00', // '2013-05-30 00:00:00',
                remarks: whereabouts,
                is_tag: isTag,
                tagword: 'ELECINSPECTED',
                is_approve: 0,
                employeeid: this.empid,
                is_delete: 0
              }) */
              return this.$axios.post('/api/UpdateDocflowElec', {
                electricalid: this.appid,
                txndate: year + '-' + month + '-' + day + ' 00:00:00', // '2013-05-30 00:00:00',
                remarks: whereabouts,
                is_tag: isTag,
                tagword: 'ELECINSPECTED',
                is_approve: 0,
                employeeid: this.empid,
                is_delete: 0
              })
            })
            .then(() => {
              /* const data = JSON.stringify({
                typeofconstruction: this.selectedType
              }) */
              return this.$axios.put('/api/UpdateElectrical/' + this.appid, {
                typeofconstruction: this.selectedType
              })
            })
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR ELECTRICAL IS EMPTY',
          width: '75%'
        })
      }
    },
    saveMechanical () {
      if (this.mechdata.length > 0) {
        this.$q.loading.show({
          message: 'SAVING DATA FOR MECHANICAL'
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        // let fulldate = month + '/' + day + '/' + year
        const fulldate = year + '-' + month + '-' + day
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getProgressFlowID') + '/' + l3s.EncryptNetwork('MECHANICAL'))
          .then((response) => {
            const decrypted = l3s.DecryptNetwork(response.data)
            const jsonize = json.parse(decrypted)
            const refpfid = jsonize[0].ref_progressflowid

            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveMechanical1') + '/' + l3s.EncryptNetwork(refpfid) + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
              .then((response) => {
                const decrypted = l3s.DecryptNetwork(response.data)
                const jsonize = json.parse(decrypted)
                const affected = jsonize.affectedRows

                if (affected > 0) {
                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getMechanicalPFID') + '/' + l3s.Encrypt('1') + '/' + l3s.Encrypt('2') + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                    .then((response) => {
                      const decrypted = l3s.DecryptNetwork(response.data)
                      const jsonize = json.parse(decrypted)
                      const maxPFID = jsonize[0].max

                      const datestarted = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('dateStart2') + '_token'))
                      this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveMechanical2') + '/' + l3s.EncryptNetwork(datestarted) + '/' + l3s.EncryptNetwork(fulldate) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                        .then((response) => {
                          const decrypted = l3s.DecryptNetwork(response.data)
                          const jsonize = json.parse(decrypted)

                          if (jsonize.affectedRows > 0) {
                            this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveMechanical3') + '/' + (empid) + '/' + l3s.EncryptNetwork(datestarted) + '/' + l3s.EncryptNetwork(maxPFID) + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                              .then((response) => {
                                for (const i in this.mechdata) {
                                  this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('saveMechanicalProgressFlow') + '/' + l3s.EncryptNetwork(this.appid) + '/' + (this.mechdata[i].name) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                }

                                this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getWhereAbout') + '/' + l3s.EncryptNetwork('MECHINSPECTED'))
                                  .then((response) => {
                                    const decrypted = l3s.DecryptNetwork(response.data)
                                    const jsonize = json.parse(decrypted)
                                    const tagcode = jsonize[0].tagcode
                                    const whereabouts = jsonize[0].whereabouts

                                    const docDate = year + '-' + month + '-' + day + ' ' + fulltime + ':00'
                                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowMech1') + '/' + l3s.EncryptNetwork(this.appid) + '/' + l3s.EncryptNetwork(docDate) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                      .then((response) => {
                                        const decrypted = l3s.DecryptNetwork(response.data)
                                        const jsonize = json.parse(decrypted)

                                        if (jsonize.affectedRows > 0) {
                                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('getMechDocflowID') + '/' + l3s.EncryptNetwork(this.appid))
                                            .then((response) => {
                                              const decrypted = l3s.DecryptNetwork(response.data)
                                              const jsonize = json.parse(decrypted)
                                              const docID = jsonize[0].max

                                              this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowMech2') + '/' + l3s.EncryptNetwork(empid) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                .then((response) => {
                                                  const decrypted = l3s.DecryptNetwork(response.data)
                                                  const jsonize = json.parse(decrypted)

                                                  if (jsonize.affectedRows > 0) {
                                                    this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowMech3-1') + '/' + (tagcode) + '/' + (docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                      .then((response) => {
                                                        const decrypted = l3s.DecryptNetwork(response.data)
                                                        const jsonize = json.parse(decrypted)

                                                        if (jsonize.affectedRows > 0) {
                                                          this.$axios.get('https://cors-anywhere.herokuapp.com/122.2.27.43/index.php?url=http://192.168.78.54/IOI/api/' + l3s.EncryptNetwork('updateDocFlowMech4') + '/' + (whereabouts) + '/' + l3s.EncryptNetwork(docID) + '/' + l3s.Encrypt('3') + '/' + l3s.Encrypt('4') + '/' + l3s.Encrypt('5'))
                                                            .then((response) => {
                                                              this.$q.loading.hide()
                                                              this.saveMessage('MECHANICAL')
                                                            })
                                                            .catch((err) => {
                                                              this.$q.loading.hide()
                                                              this.errorMessage(err)
                                                            })
                                                        } else {
                                                          this.$q.loading.hide()
                                                          Swal.fire({
                                                            icon: 'error',
                                                            title: 'Saving Failed',
                                                            text: jsonize.serverStatus
                                                          })
                                                        }
                                                      })
                                                      .catch((err) => {
                                                        this.$q.loading.hide()
                                                        this.errorMessage(err)
                                                      })
                                                  } else {
                                                    this.$q.loading.hide()
                                                    Swal.fire({
                                                      icon: 'error',
                                                      title: 'Saving Failed',
                                                      text: jsonize.serverStatus
                                                    })
                                                    // Delete Status
                                                  }
                                                })
                                                .catch((err) => {
                                                  this.$q.loading.hide()
                                                  this.errorMessage(err)
                                                })
                                            })
                                            .catch((err) => {
                                              this.$q.loading.hide()
                                              this.errorMessage(err)
                                            })
                                        } else {
                                          this.$q.loading.hide()
                                          Swal.fire({
                                            icon: 'error',
                                            title: 'Saving Failed',
                                            text: response.message
                                          })
                                        }
                                      })
                                      .catch((err) => {
                                        this.$q.loading.hide()
                                        this.errorMessage(err)
                                      })
                                  })
                                  .catch((err) => {
                                    this.$q.loading.hide()
                                    this.errorMessage(err)
                                  })
                              })
                              .catch((err) => {
                                this.$q.loading.hide()
                                this.errorMessage(err)
                              })
                          } else {
                            this.$q.loading.hide()
                            Swal.fire({
                              icon: 'error',
                              title: 'Saving Failed',
                              text: response.message
                            })
                          }
                        })
                        .catch((err) => {
                          this.$q.loading.hide()
                          this.errorMessage(err)
                        })
                    })
                    .catch((err) => {
                      this.$q.loading.hide()
                      this.errorMessage(err)
                    })
                } else {
                  this.$q.loading.hide()
                  Swal.fire({
                    icon: 'error',
                    title: 'Saving Failed',
                    text: response.message
                  })
                }
              })
              .catch((err) => {
                this.$q.loading.hide()
                this.errorMessage(err)
              })
          })
          .catch((err) => {
            this.$q.loading.hide()
            this.errorMessage(err)
          })
        this.usermechanicalaccess = false
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR MECHANICAL IS EMPTY',
          width: '75%'
        })
      }
    },
    async saveMechanical2 () {
      if (this.mechdata.length > 0) {
        if (this.selectedType.includes('Please')) {
          Swal.fire({
            icon: 'error',
            title: 'PLEASE SELECT A TYPE FOR CONSTRUCTION',
            width: '75%'
          })
          this.savedType = null
          return
        } else {
          this.savedType = this.selectedType
        }

        this.$q.loading.show({
          message: 'SAVING DATA FOR MECHANICAL'
        })

        const currentDate = new Date()
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const year = currentDate.getFullYear()
        const fulltime = hour + ':' + minutes
        const fulldate = year + '-' + month + '-' + day
        const empid = l3s.DecryptNetwork(this.$q.localStorage.getItem('__' + l3s.Encrypt('id') + '_token'))

        let str = ''

        for (const i in this.mechdata) {
          str = this.mechdata[i].name

          const allData = l3s.EncryptNetwork(fulltime + '-' + fulldate + '-' + empid + '-' + str)
          this.$q.localStorage.remove('__' + l3s.Encrypt('saveMechanical' + i) + '_token')
          this.$q.localStorage.set('__' + l3s.Encrypt('saveMechanical' + i) + '_token', allData)
        }

        this.$q.loading.hide()
        Swal.fire({
          title: 'Success',
          icon: 'success',
          text: 'SUCCESSFULLY SAVED MECHANICAL FINDINGS'
        })

        this.usermechanicalaccess = false

        if (this.$q.localStorage.has('__' + l3s.Encrypt('saveMechanical' + 0) + '_token')) {
          await this.saveToDatabaseMech(fulldate, empid)

          for (const i in this.mechdata) {
            str = this.mechdata[i].name
            await this.saveToDatabaseMechFindings(str)
          }
        }

        const saved = await this.savedMechanical

        if (saved === 2) {
          this.$axios.get('/api/GetWhereAbout' + '/' + ('MECHINSPECTED'))
            .then((response) => {
              const whereabouts = response.data[0].whereabouts
              const isTag = response.data[0].tagcode

              /* const data = JSON.stringify({
                mechanicalid: this.appid,
                txndate: year + '-' + month + '-' + day + ' ' + fulltime, // '2013-05-30 00:00:00',
                remarks: whereabouts,
                is_tag: isTag,
                tagword: 'ELECINSPECTED',
                employeeid: this.empid
              }) */
              return this.$axios.post('/api/UpdateDocflowMech', {
                mechanicalid: this.appid,
                txndate: year + '-' + month + '-' + day + ' ' + fulltime, // '2013-05-30 00:00:00',
                remarks: whereabouts,
                is_tag: isTag,
                tagword: 'ELECINSPECTED',
                employeeid: this.empid
              })
            })
            .then(() => {
              /* const data = JSON.stringify({
                typeofconstruction: this.selectedType
              }) */
              return this.$axios.put('/api/UpdateMechanical/' + this.appid, {
                typeofconstruction: this.selectedType
              })
            })
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: 'FINDINGS FOR MECHANICAL IS EMPTY',
          width: '75%'
        })
      }
    },
    async saveToDatabase (progressflow, fulltime, fulldate, employeename, empid, str, year, month, day) {
      await this.$axios.get('/api/GetProgressFlowID' + '/' + (progressflow))
        .then((response) => {
          const decrypted = response.data[0].ref_progressflowid
          // let jsonize = json.parse(decrypted)
          const refpfid = decrypted

          return this.$axios.post('/api/SaveBuilding', {
            ref_progressflowid: refpfid,
            bldgApplicationNo: this.appno,
            timeIn: fulltime,
            dateIn: fulldate,
            processby: employeename,
            remarks: str
          })
        })
        .then((response) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedbldgLG = 2
            this.savedbldgLGMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 2
            this.savedbldgArchMsg = response.data
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedbldgStruct = 2
            this.savedbldgStructMsg = response.data
          } else if (progressflow.includes('PLUMBING')) {
            this.savedbldgPlum = 2
            this.savedbldgPlumMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 2
            this.savedbldgArchMsg = response.data
          } else if (progressflow.includes('ELECTR')) {
            this.savedbldgElec = 2
            this.savedbldgElecMsg = response.data
          } else if (progressflow.includes('MECH')) {
            this.savedbldgMech = 2
            this.savedbldgMechMsg = response.data
          } else if (progressflow.includes('ZONING')) {
            this.savedbldgZoning = 2
            this.savedbldgZoningMsg = response.data
          } else if (progressflow.includes('BFP')) {
            this.savedbldgBFP = 2
            this.savedbldgBFPMsg = response.data
          }
        })
        .catch((err) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedbldgLG = 1
            this.savedbldgLGMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 1
            this.savedbldgArchMsg = err
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedbldgStruct = 1
            this.savedbldgStructMsg = err
          } else if (progressflow.includes('PLUMBING')) {
            this.savedbldgPlum = 1
            this.savedbldgPlumMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 1
            this.savedbldgArchMsg = err
          } else if (progressflow.includes('ELECTR')) {
            this.savedbldgElec = 1
            this.savedbldgElecMsg = err
          } else if (progressflow.includes('MECH')) {
            this.savedbldgMech = 1
            this.savedbldgMechMsg = err
          } else if (progressflow.includes('ZONING')) {
            this.savedbldgZoning = 1
            this.savedbldgZoningMsg = err
          } else if (progressflow.includes('BFP')) {
            this.savedbldgBFP = 1
            this.savedbldgBFPMsg = err
          }
        })
    },
    async saveToDatabase2 (progressflow, fulltime, fulldate, employeename, empid, str) {
      await this.$axios.get('/api/GetProgressFlowID' + '/' + (progressflow))
        .then((response) => {
          const decrypted = response.data[0].ref_progressflowid
          // let jsonize = json.parse(decrypted)
          const refpfid = decrypted

          return this.$axios.post('/api/SaveBuilding2', {
            ref_progressflowid: refpfid,
            bldgApplicationNo: this.appno,
            timeIn: fulltime,
            dateIn: fulldate,
            processby: employeename,
            action: '> ' + str
          })
        })
        .then((response) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedbldgLG = 2
            this.savedbldgLGMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 2
            this.savedbldgArchMsg = response.data
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedbldgStruct = 2
            this.savedbldgStructMsg = response.data
          } else if (progressflow.includes('PLUMBING')) {
            this.savedbldgPlum = 2
            this.savedbldgPlumMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 2
            this.savedbldgArchMsg = response.data
          } else if (progressflow.includes('ELECTR')) {
            this.savedbldgElec = 2
            this.savedbldgElecMsg = response.data
          } else if (progressflow.includes('MECH')) {
            this.savedbldgMech = 2
            this.savedbldgMechMsg = response.data
          } else if (progressflow.includes('ZONING')) {
            this.savedbldgZoning = 2
            this.savedbldgZoningMsg = response.data
          } else if (progressflow.includes('BFP')) {
            this.savedbldgBFP = 2
            this.savedbldgBFPMsg = response.data
          }
        })
        .catch((err) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedbldgLG = 1
            this.savedbldgLGMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 1
            this.savedbldgArchMsg = err
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedbldgStruct = 1
            this.savedbldgStructMsg = err
          } else if (progressflow.includes('PLUMBING')) {
            this.savedbldgPlum = 1
            this.savedbldgPlumMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 1
            this.savedbldgArchMsg = err
          } else if (progressflow.includes('ELECTR')) {
            this.savedbldgElec = 1
            this.savedbldgElecMsg = err
          } else if (progressflow.includes('MECH')) {
            this.savedbldgMech = 1
            this.savedbldgMechMsg = err
          } else if (progressflow.includes('ZONING')) {
            this.savedbldgZoning = 1
            this.savedbldgZoningMsg = err
          } else if (progressflow.includes('BFP')) {
            this.savedbldgBFP = 1
            this.savedbldgBFPMsg = err
          }
        })
    },
    async saveToDatabaseFirst (progressflow, fulltime, fulldate, employeename, empid, str) {
      await this.$axios.get('/api/GetProgressFlowID' + '/' + (progressflow))
        .then((response) => {
          const decrypted = response.data[0].ref_progressflowid
          const refpfid = decrypted

          return this.$axios.post('/api/SaveBuilding2', {
            ref_progressflowid: refpfid,
            bldgApplicationNo: this.appno,
            timeIn: fulltime,
            dateIn: fulldate,
            processby: employeename,
            action: '> ' + str
          })
        })
    },
    async saveToDatabaseMultiple (progressflow, str) {
      await this.$axios.get('/api/GetProgressFlowID' + '/' + (progressflow))
        .then((response) => {
          const decrypted = response.data[0].ref_progressflowid
          const refpfid = decrypted

          return this.$axios.put('/api/UpdateBuilding/' + this.appno, {
            ref_progressflowid: refpfid,
            action: '> ' + str
          })
        })
        .then((response) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedbldgLG = 2
            this.savedbldgLGMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 2
            this.savedbldgArchMsg = response.data
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedbldgStruct = 2
            this.savedbldgStructMsg = response.data
          } else if (progressflow.includes('PLUMBING')) {
            this.savedbldgPlum = 2
            this.savedbldgPlumMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 2
            this.savedbldgArchMsg = response.data
          } else if (progressflow.includes('ELECTR')) {
            this.savedbldgElec = 2
            this.savedbldgElecMsg = response.data
          } else if (progressflow.includes('MECH')) {
            this.savedbldgMech = 2
            this.savedbldgMechMsg = response.data
          } else if (progressflow.includes('ZONING')) {
            this.savedbldgZoning = 2
            this.savedbldgZoningMsg = response.data
          } else if (progressflow.includes('BFP')) {
            this.savedbldgBFP = 2
            this.savedbldgBFPMsg = response.data
          }
        })
        .catch((err) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedbldgLG = 1
            this.savedbldgLGMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 1
            this.savedbldgArchMsg = err
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedbldgStruct = 1
            this.savedbldgStructMsg = err
          } else if (progressflow.includes('PLUMBING')) {
            this.savedbldgPlum = 1
            this.savedbldgPlumMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedbldgArch = 1
            this.savedbldgArchMsg = err
          } else if (progressflow.includes('ELECTR')) {
            this.savedbldgElec = 1
            this.savedbldgElecMsg = err
          } else if (progressflow.includes('MECH')) {
            this.savedbldgMech = 1
            this.savedbldgMechMsg = err
          } else if (progressflow.includes('ZONING')) {
            this.savedbldgZoning = 1
            this.savedbldgZoningMsg = err
          } else if (progressflow.includes('BFP')) {
            this.savedbldgBFP = 1
            this.savedbldgBFPMsg = err
          }
        })
    },
    async saveToDatabaseOcc (progressflow, fulltime, fulldate, employeename, empid, str, year, month, day) {
      await this.$axios.get('/api/GetProgressFlowID' + '/' + (progressflow))
        .then((response) => {
          const refpfid = response.data[0].ref_progressflowid

          return this.$axios.post('/api/SaveOccupancy', {
            ref_progressflowid: refpfid,
            occupancyid: this.appid,
            accomplish: 0,
            employeeid: this.employeeid,
            datetimeStart: month + '/' + day + '/' + year,
            datetimeEnd: month + '/' + day + '/' + year,
            datetimeEncoded: month + '/' + day + '/' + year,
            encodedBy: this.employeeid,
            remarks: str,
            inspector: this.employeeid
          })
        })
        .then((response) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedoccLG = 2
            this.savedoccLGMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 2
            this.savedoccArchMsg = response.data
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedoccStruct = 2
            this.savedoccStructMsg = response.data
          } else if (progressflow.includes('PLUMBING')) {
            this.savedoccPlum = 2
            this.savedoccPlumMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 2
            this.savedoccArchMsg = response.data
          } else if (progressflow.includes('ELECTR')) {
            this.savedoccElec = 2
            this.savedoccElecMsg = response.data
          } else if (progressflow.includes('MECH')) {
            this.savedoccMech = 2
            this.savedoccMechMsg = response.data
          } else if (progressflow.includes('ZONING')) {
            this.savedoccZoning = 2
            this.savedoccZoningMsg = response.data
          } else if (progressflow.includes('BFP')) {
            this.savedoccBFP = 2
            this.savedoccBFPMsg = response.data
          }
        })
        .catch((err) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedoccLG = 1
            this.savedoccLGMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 1
            this.savedoccArchMsg = err
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedoccStruct = 1
            this.savedoccStructMsg = err
          } else if (progressflow.includes('PLUMBING')) {
            this.savedoccPlum = 1
            this.savedoccPlumMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 1
            this.savedoccArchMsg = err
          } else if (progressflow.includes('ELECTR')) {
            this.savedoccElec = 1
            this.savedoccElecMsg = err
          } else if (progressflow.includes('MECH')) {
            this.savedoccMech = 1
            this.savedoccMechMsg = err
          } else if (progressflow.includes('ZONING')) {
            this.savedoccZoning = 1
            this.savedoccZoningMsg = err
          } else if (progressflow.includes('BFP')) {
            this.savedoccBFP = 1
            this.savedoccBFPMsg = err
          }
        })
    },
    async saveToDatabaseOccFirst (progressflow, fulltime, fulldate, employeename, empid, str, year, month, day) {
      await this.$axios.get('/api/GetProgressFlowID' + '/' + (progressflow))
        .then((response) => {
          const refpfid = response.data[0].ref_progressflowid

          return this.$axios.post('/api/SaveOccupancy', {
            ref_progressflowid: refpfid,
            occupancyid: this.appid,
            accomplish: 0,
            employeeid: this.employeeid,
            datetimeStart: month + '/' + day + '/' + year,
            datetimeEnd: month + '/' + day + '/' + year,
            datetimeEncoded: month + '/' + day + '/' + year,
            encodedBy: this.employeeid,
            remarks: str,
            inspector: this.employeeid
          })
        })
    },
    async saveToDatabaseOccMulti (progressflow, str) {
      await this.$axios.get('/api/GetProgressFlowID' + '/' + (progressflow))
        .then((response) => {
          const refpfid = response.data[0].ref_progressflowid

          return this.$axios.put('/api/SaveOccupancyMulti/' + this.appid, {
            ref_progressflowid: refpfid,
            remarks: str
          })
        })
        .then((response) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedoccLG = 2
            this.savedoccLGMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 2
            this.savedoccArchMsg = response.data
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedoccStruct = 2
            this.savedoccStructMsg = response.data
          } else if (progressflow.includes('PLUMBING')) {
            this.savedoccPlum = 2
            this.savedoccPlumMsg = response.data
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 2
            this.savedoccArchMsg = response.data
          } else if (progressflow.includes('ELECTR')) {
            this.savedoccElec = 2
            this.savedoccElecMsg = response.data
          } else if (progressflow.includes('MECH')) {
            this.savedoccMech = 2
            this.savedoccMechMsg = response.data
          } else if (progressflow.includes('ZONING')) {
            this.savedoccZoning = 2
            this.savedoccZoningMsg = response.data
          } else if (progressflow.includes('BFP')) {
            this.savedoccBFP = 2
            this.savedoccBFPMsg = response.data
          }
        })
        .catch((err) => {
          if (progressflow.includes('LINE AND GRADE')) {
            this.savedoccLG = 1
            this.savedoccLGMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 1
            this.savedoccArchMsg = err
          } else if (progressflow.includes('STRUCTURAL')) {
            this.savedoccStruct = 1
            this.savedoccStructMsg = err
          } else if (progressflow.includes('PLUMBING')) {
            this.savedoccPlum = 1
            this.savedoccPlumMsg = err
          } else if (progressflow.includes('ARCHI')) {
            this.savedoccArch = 1
            this.savedoccArchMsg = err
          } else if (progressflow.includes('ELECTR')) {
            this.savedoccElec = 1
            this.savedoccElecMsg = err
          } else if (progressflow.includes('MECH')) {
            this.savedoccMech = 1
            this.savedoccMechMsg = err
          } else if (progressflow.includes('ZONING')) {
            this.savedoccZoning = 1
            this.savedoccZoningMsg = err
          } else if (progressflow.includes('BFP')) {
            this.savedoccBFP = 1
            this.savedoccBFPMsg = err
          }
        })
    },
    async saveToDatabaseSign (fulltime, fulldate, employeename, empid, str) {
      /* const signData = JSON.stringify({
        ref_progressflowid: 0,
        signageid: this.appid,
        findings: str,
        datetimeStart: fulldate,
        datetimeEnd: fulldate,
        datetimeEncoded: fulldate,
        encodedBy: employeename,
        inspector: empid
      }) */
      await this.$axios.post('SaveSignage', {
        ref_progressflowid: 0,
        signageid: this.appid,
        findings: str,
        datetimeStart: fulldate,
        datetimeEnd: fulldate,
        datetimeEncoded: fulldate,
        encodedBy: employeename,
        inspector: empid
      })
        .then((response) => {
          this.savedSignage = 2
          this.savedSignageMsg = response.data
        })
        .catch((err) => {
          this.savedSignage = 1
          this.savedSignageMsg = err
        })
    },
    async saveToDatabaseElec (fulltime, fulldate, empid) {
      /* const elecData = JSON.stringify({
        ref_progressflowid: 0,
        electricalid: this.appid,
        dateStart: fulldate,
        dateEnd: fulldate,
        inspector1: empid,
        inspector2: empid
      }) */
      await this.$axios.post('SaveElectrical', {
        ref_progressflowid: 0,
        electricalid: this.appid,
        dateStart: fulldate,
        dateEnd: fulldate,
        inspector1: empid,
        inspector2: empid
      })
    },
    async saveToDatabaseElecFindings (str) {
      /* const eFindData = JSON.stringify({
        electricalid: this.appid,
        findings: str
      }) */
      await this.$axios.post('SaveElectricalFindings', {
        electricalid: this.appid,
        findings: str
      })
        .then((response) => {
          this.savedElectrical = 2
          this.savedElectricalMsg = response.data
        })
        .catch((err) => {
          this.savedElectrical = 1
          this.savedElectricalMsg = err
        })
    },
    async saveToDatabaseMech (fulldate, empid) {
      /* const mechData = JSON.stringify({
        ref_progressflowid: 0,
        mechanicalid: this.appid,
        dateStart: fulldate,
        dateEnd: fulldate,
        employeeid: empid
      }) */
      await this.$axios.post('SaveMechanical', {
        ref_progressflowid: 0,
        mechanicalid: this.appid,
        dateStart: fulldate,
        dateEnd: fulldate,
        employeeid: empid
      })
    },
    async saveToDatabaseMechFindings (str) {
      /* const mFindData = JSON.stringify({
        mechanicalid: this.appid,
        findings: str
      }) */
      await this.$axios.post('SaveMechanicalFindings', {
        mechanicalid: this.appid,
        findings: str
      })
        .then((response) => {
          this.savedMechanical = 2
          this.savedMechanicalMsg = response.data
        })
        .catch((err) => {
          this.savedMechanical = 1
          this.savedMechanicalMsg = err
        })
    },
    errorMessage (err) {
      if (err.message === 'Network Error') {
        Swal.fire({
          icon: 'error',
          title: 'Saving Failed',
          text: 'No Connection on Server'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Saving Failed',
          text: err.message
        })
      }
    },
    showmap () {
      // Swal.fire({
      //   icon: 'info',
      //   title: `I'm the map now`
      // })
      // let map = new google.maps.Map(document.getElementById('map'), {
      //     center: {lat: -34.397, lng: 150.644},
      //     zoom: 8
      // })
      /* eslint-disable no-console */

      // googleMapsClient.geocode({ address: this.location })
      //   .asPromise()
      //   .then((response) => {
      //     console.log(response.json.results)
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })

      // const usehttps = false
      // let queryobject = geocoder.serialize('City Hall Dr, Poblacion District, Davao City, Davao del Sur, Philippines', usehttps)

      // request(queryobject, function (error, res, body) {
      //   if (error) {
      //     // console.error(error)
      //   } else {
      //     // console.log(geocoder.parse(body))
      //   }
      // })

      // delete Icon.Default.prototype._getIconUrl

      // Icon.Default.mergeOptions({
      //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
      //   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      // })

      /* this.map = true */
      this.$router.push('map', () => {})
    },
    handleHold ({ evt, ...info }) {
      this.info = info
    },
    handler (index, type) {
      return (props) => {
        // this.deleterow = true
        this.deleteitem = index

        if (type === 'Building LG') {
          this.deleterowblg = true
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Occupancy LG') {
          this.deleterowblg = false
          this.deleterowolg = true
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Building Arch') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = true
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Occupancy Arch') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = true
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Building Struct') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = true
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Occupancy Struct') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = true
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Building Plum') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = true
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Occupancy Plum') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = true
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Building Elec') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = true
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Occupancy Elec') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = true
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Building Mech') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = true
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Occupancy Mech') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = true
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Signage') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = true
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Electrical') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = true
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Mechanical') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = true
          this.deleterowzon = false
          this.deleterowbfp = false
        } else if (type === 'Zoning') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = true
          this.deleterowbfp = false
        } else if (type === 'BFP') {
          this.deleterowblg = false
          this.deleterowolg = false
          this.deleterowbar = false
          this.deleterowoar = false
          this.deleterowbst = false
          this.deleterowost = false
          this.deleterowbpl = false
          this.deleterowopl = false
          this.deleterowbel = false
          this.deleterowoel = false
          this.deleterowbme = false
          this.deleterowome = false
          this.deleterowsig = false
          this.deleterowele = false
          this.deleterowmec = false
          this.deleterowzon = false
          this.deleterowbfp = true
        }
      }
    },
    checkPage () {},
    async saveImages (image) {
      /* const camera = await document.getElementById('camera').files[0] */
      this.images.push(image)
      this.imagesUnique = [...new Set(this.images)]
    },
    openImages () {
      /* const camera = document.getElementById('camera').files
      console.log(camera) */
      console.log(this.imagesUnique)
    }
  },
  created () {
    this.intro()
      .then(this.checkDark())
  },
  mounted () {
    this.intro()
      .then(this.checkAuth())
      .then(this.fetchInfo())
      /* .then(location.reload(true)) */
  },
  /* computed: {
    if (this.$q.sessionStorage.has('__' + l3s.Encrypt('info_appno')) === true) {
      this.appno = l3s.DecryptNetwork(this.$q.sessionStorage.getItem('__' + l3s.Encrypt('info_appno')))
      console.log('appno: ' + this.appno)
    }
  } */
  beforeDestroy () {
    /* window.removeEventListener('unload', this.fetchInfo()) */
    const camera = document.getElementById('camera')
    camera.removeEventListener('change')
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 0fr 4fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "searchbar searchcircle . logout";
}

.searchbar {
  grid-area: searchbar;
  width: 25rem;
  font-size: 1.8em;
}

.searchcircle {
  grid-area: searchcircle;
  margin-top: 9px;
}

.logout {
  grid-area: logout;
  /* width: 40%; */
  width: 200px;
  height: 40px;
  margin-top: 9px;
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: "ownername ownername"
                        "address location"
                        "scope typeoruse";
}
.ownername {
  grid-area: ownername;
}

.address {
  grid-area: address;
  width: 630px;
}

.location {
  grid-area: location;
  width: 100%;
}

.scope {
  grid-area: scope;
  width: 630px;
}

.typeoruse {
  grid-area: typeoruse;
  width: 100%;
}

.typeofcon {
  grid-area: typeofcon;
  margin-bottom: 30px;
}

.dtable {
   width:100%;
}

.q-input-target {
  text-align: center;
}

.workArea {
    align-items: center;
    align-content: center;
    background-size: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    height: 100%;
  }

.page {
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    position: relative;
  }

.page::before {
    background-image: url("../assets/bg.svg");
    /* background-image: url("..\statics\background-ling2.jpg"); */
    background-color: lightslategray;
    background-blend-mode: multiply;
    background-size: cover;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 0.9;
  }

.page--dark {
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    position: relative;
  }

.page--dark::before {
    background-image: url("../assets/bg.svg");
    background-color: rgb(28, 28, 29);
    background-blend-mode: multiply;
    background-size: cover;
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    opacity: 0.9;
  }

label {
  font-size: 1.2em;
  /* color: #1a237e; */
  color: #ffffff;
}

/* .datatable {
  /* font-size: 12px;
} */

.datatable .q-table__middle {
  max-height: 200px;
}

.datatable .q-table__top,
.datatable .q-table__bottom,
.datatable thead tr:first-child th {
  /* background-color: #283593; */
  background-color: #cfd8dc;
}

.datatable thead tr:first-child th {
  position: sticky;
  top: 0;
  opacity: 1;
  z-index: 1;
}

.dialogbutton {
  display: block;
  color: grey;
  font-size: 1rem;
  background: #2979ff;
  float: right;
}

.saveArea {
  display: grid;
  grid-template-columns: 8fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: ". button";
}

.savebutton {
  grid-area: button;
}

/* #map {
  height: 100%;
} */

.mapbutton {
  width: 8em;
}

.mobilemode2 {
  display: none;
}

.tab-mob {
  display: none;
}

@media screen and (max-width: 507px) {
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 0fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "searchbar searchcircle logout";
  }

  .searchbar {
    grid-area: searchbar;
    width: 15rem;
    font-size: 1.8em;
  }

  .searchcircle {
    grid-area: searchcircle;
    margin-top: 9px;
  }

  .logout {
    grid-area: logout;
    /* width: 40%; */
    width: 100%;
    height: 40px;
    margin-top: 9px;
  }

  .details {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "ownername" "address" "location" "scope" "typeoruse";
  }

  .ownername {
    width: 100%;
  }

  .address {
    width: 100%;
  }

  .location {
    width: 100%;
  }

  .scope {
    width: 100%;
  }

  .typeoruse {
    width: 100%;
  }

  .saveArea {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "button";
  }

  .savebutton {
    grid-area: button;
    height: 50px;
  }

  .mobilemode {
    display: none;
  }

  .mobilemode2 {
    display: inherit;
    width: 100%;
    height: 40px;
    margin: 0;
  }

  .tab-mob {
    display: inherit;
    width: 100%;
    height: 40px;
    margin: 0;
  }
}

@media screen and (max-width: 1080px) and (min-width: 508px){
  .grid-container {
    display: grid;
    grid-template-columns: 1fr 0fr 2fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "searchbar searchcircle . logout";
  }

  .details {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: "ownername" "address" "location" "scope" "typeoruse";
  }

  .ownername {
    grid-area: ownername;
    width: 100%;
  }

  .address {
    grid-area: address;
    width: 100%;
  }

  .location {
    grid-area: location;
    width: 100%;
  }

  .scope {
    grid-area: scope;
    width: 100%;
  }

  .typeoruse {
    grid-area: typeoruse;
    width: 100%;
  }

  .saveArea {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: ". button";
  }

  .savebutton {
    grid-area: button;
    height: 40px;
    width: 190px;
  }

  .tab-mob {
    display: inherit;
    width: 100%;
    height: 40px;
    margin: 0;
  }
}
</style>
