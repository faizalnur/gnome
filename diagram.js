
var cy = cytoscape({
    container: document.getElementById("gnome-diagram"),
    elements: [],
    style: [
      {
        selector: "node",
        style: {
          "background-color": "data(color)",
          label: "data(label)",
          shape: "data(shape)",
          width: "data(width)",
          height: "data(height)",
          "text-outline-color": "#000000",   // black outline color
          "text-outline-width": 2,           // outline width in pixels
          "color": "#FFFFFF",                 // white text color
          "font-weight": "bold"   
        }
      },
      {
        selector: "edge",
        style: {
          "line-color": "#000000",
          "curve-style": "bezier",
          "target-arrow-shape": "none",
          width: 2,
          label: "data(relationshipLabel)",
          "text-outline-color": "#000000",   // black outline color
          "text-outline-width": 2,           // outline width in pixels
          "color": "#FFFFFF",                 // white text color
          "font-weight": "bold"   
          
        }
      },
      {
        selector: "edge.taxi-upward",
        style: {
          "line-color": "#000000",
          "curve-style": "taxi",
          "taxi-direction": "upward",
          "taxi-turn": "50",
          "taxi-turn-min-distance": "5",
          "text-outline-color": "#000000",   // black outline color
          "text-outline-width": 2,           // outline width in pixels
          "color": "#FFFFFF",                 // white text color
          "font-weight": "bold"   
        }
      },      {
        selector: "edge.taxi-upward2",
        style: {
          "line-color": "#000000",
          "curve-style": "taxi",
          "taxi-direction": "upward",
          "taxi-turn": "25",
          "taxi-turn-min-distance": "3",
          "text-outline-color": "#000000",   // black outline color
          "text-outline-width": 2,           // outline width in pixels
          "color": "#FFFFFF",                 // white text color
          "font-weight": "bold"   
        }
      }
    ],
    layout: {
      name: "grid"
    }
  });

  function addNode(data) {
    var color_trait={
      'male-carrier':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFkM/zK4O/OP+lWwAAABVJREFUeJxjYGBgqP///wDDKD0oaACByaHr3+Wk2gAAAABJRU5ErkJggg==',
      'male-hemophiliac':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFK4O/2BLxTgAAAA5JREFUeJxjYBgFgwkAAAGQAAHTuxD+AAAAAElFTkSuQmCC',
      'male-normal':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFK4O/2BLxTgAAAA5JREFUeJxjYBgFgwkAAAGQAAHTuxD+AAAAAElFTkSuQmCC',
      'female-normal':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRF/+2rszb+9gAAAA5JREFUeJxjYBgFgwkAAAGQAAHTuxD+AAAAAElFTkSuQmCC',
      'female-carrier':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRF/+2r8KNL2m2LiwAAABVJREFUeJxjYGBgqP///wDDKD0oaACByaHr3+Wk2gAAAABJRU5ErkJggg==',
      'female-hemophiliac':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRF8KNLdpo5OAAAAA5JREFUeJxjYBgFgwkAAAGQAAHTuxD+AAAAAElFTkSuQmCC',
    }
    var label = data.nameperson;
    var shape = data.gender=='male'?'rectangle':'ellipse';
    // var color = colorList[data.gender+'-'+data.trait];
    
    if (label === "") {
      alert("Please enter a label for the node.");
      return;
    }

    var nodeId = "node-"+data.numcard+"-"+data.idcard+"-"+data.idmenu
    var nodeData = {
      id: nodeId,
      label: label,
      shape: shape,
      width: 50,
      height: 50,
    };
    cy.add({ data: nodeData });
    // Add the border style to the newly added node
    var newNode = cy.$('#' + nodeId);
    newNode.style({
      'border-color': '#000000',
      'border-width': 2,
      'border-style': 'solid',
      'background-image':'url('+color_trait[data.gender+'-'+data.trait]+')'
    });

    if(data.idmenu==1){
      generatePerson1(nodeId,data)
      if(data.rb=='married'){
        generateMarriedPoint(data,nodeId)
      }
    }else{
      generatePerson2(nodeId,data)
      if(data.rb=='haveChildren'){
        generateChildrenPoint(data,nodeId)
      }
    }


  }

  function generatePerson1(nodeId,data){
    //============== Set New Position ==============
    var newnode=cy.$("#" + nodeId);
    positionNewnode = newnode.position();
    newnode.position({
      x:positionNewnode.x+150,
      y:positionNewnode.y+50
    })
    if(data.childpoint=='null'){
      newnode.position({
        x:positionNewnode.x+150,
        y:positionNewnode.y+50
      })
    }else{
      var childpoint=cy.$("#" + data.childpoint);
      var positionStart = childpoint.position();
      newnode.position({
        x:positionStart.x-200 + (200 * parseInt(data.position)),
        y:positionStart.y+100
      })
      var edgeData = {
          source: nodeId,
          target: data.childpoint,
          relationshipLabel: ""// Add the 'taxi' class to the edge
      };
       var upward=data.position%2==0?"taxi-upward":"taxi-upward2"
      cy.add({ data: edgeData,
          classes: upward });
    }

  }

  function generatePerson2(nodeId,data){
    var marriageID = 'mrg-'+data.numcard+"-"+data.idcard;
    //============== Set New Position ==============
      var marrigeNode=cy.$("#" + marriageID);
      var newnode = cy.$("#" + nodeId);
      positionMarrigeNode = marrigeNode.position();
      newnode.position({
        x:positionMarrigeNode.x+70,
        y:positionMarrigeNode.y
      })
      var edgeData = {
        source: marriageID,
        target: nodeId,
        relationshipLabel: ""
      };
      cy.add({ data: edgeData });
    }

  function generateMarriedPoint(data,nodeId){
      var newnode=cy.$("#" + nodeId);
      var marriageID = 'mrg-'+data.numcard+"-"+data.idcard;
        var mrgNodeData = {
          id: marriageID,
          label: 'Married',
          shape: "ellipse",
          color: "#000000",
          width: 10,
          height: 10
      };
      cy.add({ data: mrgNodeData });
      positionNewnode = newnode.position();
      var mrgNode=cy.$("#" + marriageID);
      mrgNode.position({
        x:positionNewnode.x+70,
        y:positionNewnode.y
      })
      var edgeData = {
          source: marriageID,
          target: nodeId,
          relationshipLabel: ""
      };
      cy.add({ data: edgeData });
  }

  function generateChildrenPoint(data,nodeId){
      var childPointID = 'childpoint-'+data.numcard+"-"+data.idcard;
      var childPoint = {
        id: childPointID,
        label: 'Have Child',
        shape: "ellipse",
        color: "#000000",
        width: 10,
        height: 10
    };
    cy.add({ data: childPoint });
    var marriageID = 'mrg-'+data.numcard+"-"+data.idcard;
    var marrigeNode=cy.$("#" + marriageID);
    positionMarrigeNode = marrigeNode.position();

    var childPointNode=cy.$("#" + childPointID);
    childPointNode.position({
      x:positionMarrigeNode.x,
      y:positionMarrigeNode.y+100
    })
    var edgeData = {
        source: marriageID,
        target: childPointID,
        relationshipLabel: ""
    };
    cy.add({ data: edgeData });
  }