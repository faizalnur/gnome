//======init global var
var idCard=1
var forms=[]
var person=0
var generationlist=[]
//============== Card Generation ===========

function generateGeneration(generationNum,childPoint=null,position=1) {
    const calloutContainer = $("#gnome-menu");
    const htmlCode = `
      <div class="bd-callout bd-callout-${generateColor(generationNum)} w-100" data-toggle="modal" data-target="#gnomeModal" onClick="generateModalHeader('${generationNum}','${idCard}','${childPoint}','${position}')">
        <h5>Generation ${generationNum}</h5>
        K - N
      </div>
    `;
    calloutContainer.append(htmlCode);
    generationlist.push({id:idCard,generationNum:generationNum,class:'bd-callout-success'})
    idCard++;
}

function generateColor(id){
    if(id%4==0){
        return 'success'
    }else if(id%3==0){
        return 'info'
    }else if(id%2==0){
        return 'danger'
    }else{
        return 'primary'
    }
}

function generatePerson(id,numcard,idCard,childPoint=null,position=1){
    var seqId=id+1
    var formId="form"+seqId
    const generatePerson = $("#personField");

    //===== checkbox ========
    var checkbox=''
    if(seqId==1){
        Disabledclass=""
        checkbox=`<input class="form-check-input" type="checkbox" id="rb${seqId}" onchange="checkedMarried(event,${seqId},${numcard},${idCard})" value="married">
                    <label class="form-check-label" for="exampleCheckbox">
                    Married
                    </label>`
    } else{
        Disabledclass="disabled-form"
        checkbox=`<input class="form-check-input" type="checkbox" id="rb${seqId}" onchange="checkedChild(event,${seqId},${numcard},${idCard})" value="haveChildren">
                    <label class="form-check-label" for="exampleCheckbox">
                    Have children
                    </label>`
    }

    var htmlCode = `<div class="my-4 py-3 ${Disabledclass}" id="${formId}">`
    htmlCode = htmlCode + `
        <input type="hidden" class="form-control" id="numcard${seqId}" value="${numcard}" placeholder="Enter name">
        <input type="hidden" class="form-control" id="idcard${seqId}" value="${idCard}" placeholder="Enter name">
        <input type="hidden" class="form-control" id="childpoint${seqId}" value="${childPoint}" placeholder="Enter name">
        <input type="hidden" class="form-control" id="position${seqId}" value="${position}" placeholder="Enter name">
        <div class="form-group">
            <label for="nameInput">Name</label>
            <input type="text" class="form-control" id="name${seqId}" placeholder="Enter name">
        </div>
        <div class="form-group">
            <label for="genderSelect">Gender</label>
            <select class="form-control" id="gender${seqId}">
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>
        <div class="form-group">
            <label for="traitInput">Trait</label>
            <select class="form-control" id="trait${seqId}">
                <option value="normal">Normal</option>
                <option value="hemophiliac">Hemophiliac</option>
                <option value="carrier">Carrier</option>
            </select>
        </div>
        <div class="form-check">
            ${checkbox}
        </div>
        <div id="childInput${seqId}">
        </div>
        <div class="form-group float-right">
            <button class="small-btn-primary" onClick=saveData(${seqId})>Submit</button>
        </div>

    `;
    htmlCode = htmlCode + '</div>'
    generatePerson.append(htmlCode);
    person ++;
}

function emptyPerson(){
    const generatePerson = $("#personField");
    person=0
    generatePerson.html('');
}

generateGeneration(1)

//=============== Modal ==================
$('#gnomeModal').on('hidden.bs.modal', function () {
    emptyPerson()
});

function generateModalHeader(numCard,idCard,childPoint=null,position=1){
    const modalGnomeHeader = $("#modalGnomeHeader");
    modalGnomeHeader.html(`
    <div class="bd-callout bd-callout-${generateColor(numCard)} w-100" data-toggle="modal" data-target="#gnomeModal">
    <h5>Generation ${numCard}</h5>
        K - N
    </div>
    `);
    var id = 0
    var detailData=getDetail(numCard,idCard,id);
    if(!detailData.length){
        generatePerson(id,numCard,idCard,childPoint,position)
    }else{
        for(let i=0;i<detailData.length;i++){
            generatePersonDetail(detailData[i])
        }
    }
    
}

function checkedMarried(e,id,header,idCard) {
    if (e.target.checked) {
        generatePerson(id,header,idCard)
    }else{
        formId="#form"+id
        $(formId).remove();
    }
  }

function checkedChild(e,id,header,idCar) {
    if (e.target.checked) {
        generateChildNumber(id,header)
    }else{
        formId="#childInput"+id
        $(formId).html('');
    }
}

function generateChildNumber(id){
    var inputChildren=`
        <div class="input-group w-50 my-3">
        <div class="input-group-prepend">
        <button id="min${id}" class="btn btn-primary font-weight-bolder" onClick="numbClick('min','childval${id}')">-</button>
        </div>
        <input type="text" id="childval${id}" class="form-control" oninput="restrictNonNumeric(event)" placeholder="number of children" aria-label="Input group example" aria-describedby="btnGroupAddon">
        <div class="input-group-prepend">
        <button id="plus${id}" class="btn btn-primary font-weight-bolder" onClick="numbClick('add','childval${id}')">+</button>
        </div>
    </div>
    `
    const generateChildNumberInput = $("#childInput"+id);
    generateChildNumberInput.html(inputChildren);
}

function restrictNonNumeric(event) {
    var input = event.target;
    input.value = input.value.replace(/\D/g, '');
}

function numbClick(action, idForm) {
    var currentVal = $('#' + idForm).val();
    if(!currentVal){
        currentVal=0
    }
    // Validate if currentVal can be parsed as an integer
    if (!isNaN(currentVal) && currentVal !== "") {
      var val = action === 'add' ? parseInt(currentVal) + 1 : parseInt(currentVal) - 1;
      $('#' + idForm).val(val);
    } else {
      alert("Invalid input. Please enter a valid number.");
    }
}

function saveData(id){
    var nextId=id+1
    var data = {
        rb:$('#rb'+id).prop("checked")?$('#rb'+id).val():'',
        numcard:$('#numcard'+id).val(),
        idcard:$('#idcard'+id).val(),
        idmenu:id,
        formId:'#form'+id,
        nameperson:$('#name'+id).val(),
        gender:$('#gender'+id).val(),
        trait:$('#trait'+id).val(),
        childpoint:$('#childpoint'+id).val(),
        position:$('#position'+id).val(),
    }
    forms.push(data)
    addNode(data)
    if(data.rb=='married'){
        $("#form"+nextId).removeClass("disabled-form");
    }
    $(data.formId).addClass("disabled-form");
    if(data.rb=='haveChildren'){
        var numcard=parseInt($('#numcard'+id).val());
        let countNumcard = forms.reduce((accumulator, currentObject) => {
            if (currentObject.numcard === numcard+1) {
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);
        
        var totalCard = parseInt($('#childval'+id).val());
        totalCardGen=0
        totalCardNum=getDetailNumcard(numcard+1)
        totalCardGen=totalCardNum.length?totalCardNum.length:0
        for(let a=0;a<totalCard;a++){
            generateGeneration(numcard+1,'childpoint-'+data.numcard+"-"+data.idcard,totalCardGen++)
        }
    }

    
    console.log(forms)
    
}

function getDetail(numcard,idcard,idmenu){
    var detail= forms.filter(function(item) {
        return item.numcard === numcard &&
                item.idcard ===idcard

    });
    return detail
}

function getDetailNumcard(numcard){
    var detail= forms.filter(function(item) {
        return item.numcard == numcard 
    });
    return detail
}

function generatePersonDetail(detail){
    var seqId=detail.id+1
    const generatePerson = $("#personField");
    //===== checkbox ========
    var checkbox=''
    // if(seqId==1){
    //     checkbox=`<input class="form-check-input" type="checkbox" id="rb${seqId}" onchange="checkedMarried(event,${seqId},${detail.numcard},${detail.idcard})" value="married">
    //                 <label class="form-check-label" for="exampleCheckbox">
    //                 Married
    //                 </label>`
    // } else{
    //     checkbox=`<input class="form-check-input" type="checkbox" id="rb${seqId}" onchange="checkedChild(event,${seqId},${detail.numcard},${detail.idcard})" value="haveChildren">
    //                 <label class="form-check-label" for="exampleCheckbox">
    //                 Have children
    //                 </label>`
    // }

    var htmlCode = `<div class="my-4 py-3 disabled-form" id="${detail.formId}">`
    htmlCode = htmlCode + `
        <input type="hidden" class="form-control" id="numcard${seqId}" value="${detail.numcard}" placeholder="Enter name">
        <input type="hidden" class="form-control" id="idcard${seqId}" value="${detail.idcard}" placeholder="Enter name">
        <input type="hidden" class="form-control" id="childpoint${seqId}" value="${detail.childPoint}" placeholder="Enter name">
        <input type="hidden" class="form-control" id="position${seqId}" value="${detail.position}" placeholder="Enter name">
        <div class="form-group">
            <label for="nameInput">Name</label>
            <input type="text" class="form-control" id="name${seqId}" placeholder="Enter name" value="${detail.nameperson}">
        </div>
        <div class="form-group">
            <label for="genderSelect">Gender</label>
            <select class="form-control" id="gender${seqId}">
                <option value="male" ${detail.gender=='male'?'selected':''}>Male</option>
                <option value="female" ${detail.gender=='female'?'selected':''}>Female</option>
            </select>
        </div>
        <div class="form-group">
            <label for="traitInput">Trait</label>
            <select class="form-control" id="trait${seqId}">
                <option value="normal" ${detail.trait=='normal'?'selected':''}>Normal</option>
                <option value="hemophiliac" ${detail.trait=='hemophiliac'?'selected':''}>Hemophiliac</option>
                <option value="carrier"  ${detail.trait=='carrier'?'selected':''}>Carrier</option>
            </select>
        </div>
        <div class="form-check">
            ${checkbox}
        </div>
        <div id="childInput${seqId}">
        </div>
        <div class="form-group float-right">
            <button class="small-btn-primary" onClick=saveData(${seqId})>Submit</button>
        </div>

    `;
    htmlCode = htmlCode + '</div>'
    generatePerson.append(htmlCode);
}