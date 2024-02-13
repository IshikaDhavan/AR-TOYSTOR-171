var uid = null;

AFRAME.registerComponent("marker-handler",{
    init:async function(){

        //get toys collection from firebase
        var toys = await this.getToys();

        if(uid == null)
        {
            this.askUserId
        }

        this.el.addEventListener("markerFound",(e) => {
            if(uid === null){
            var markerId = this.el.id;
            this.handleMarkerFound(toys,markerId)
            }
        })
        this.el.addEventListener("markerLost",(e) => {
            if(uid !== null)
            {
                this.handleMarkerLost()
            }
        })
    } ,
    askUserId: function(){
        var iconURL = "https://raw.githubusercontent.com/whitehatjr/ar-toy-store-assets/master/toy-shop.png"

        swal({
            title: "Welcome to Toy Store",
            icon: iconURL,
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your UID",
                    input: string
                }
            }
        }).then(inputValue => {
            uid = inputValue;
        })
    },
    handleMarkerFound:function(toys, markerId){
        var toy = toy.filter(toy => toy.id === markerId)[0]

        if(toy.out_of_stock){
            swal({
                icon: "warning",
                title: toy.toy_name.toUpperCase(),
                text: "This toy is currently out of stock!!!",
                timer: 2500,
                buttons: false
            })
        } else 
        {

            var model = document.querySelector(`#model-${toy.id}`)
            model.setAttribute("position", toy.model_geometry.position)
            model.setAttribute("rotation", toy.model_geometry.rotation) 
            model.setAttribute("scale", toy.model_geometry.scale)
            
            var model = document.querySelector(`#model-${toy.id}`)
            model.setAttribute("visible", true)

            var mainPlane = document.querySelector(`#main-plane-${toy.id}`)
            mainPlane.setAttribute("visible",true)

            var buttondiv = document.getElementById("button-div")
            buttondiv.style.display = flex;

            var ratingbutton = document.getElementById("ratingbutton")
            var orderbutton = document.getElementById("orderbutton")

            ratingbutton.addEventListener("click",(e) => {
                uid = uid.toUpperCase();
                this.handleOrder(uid, toy);
                swal({
                    icon: "warning",
                    title: "Rate Toy",
                    text: "Work in progress..."
                })
            })
            orderbutton.addEventListener("click",(e) => {
                swal({
                    icon: "https://i.imgur.com/4NZ6uLY.jpg",
                    title: "Thanks for ordering",
                    text: "Order will be delivered soon"
                })
            })     
        }
    },
    handleOrder: function(uid, toy){
        firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then( doc => {
            var details = doc.data;

            if(details["current_orders"][toy.id]){
                details["current_orders"][toy.id]["quantity"] += 1;

                var currentQuantity = details["current_orders"][toy.id]["quantity"]

                details["current_orders"][toy.id]["subtotal"] = 
                currentQuantity * toy.price;
            } else {
                details["current_orders"][toy.id] = {
                    item: toy.toy_name,
                    price: toy.price,
                    quantity: 1,
                    subtotal: toy.price * 1
                };
            }

            details.total_bill += toy.price;

            //db update
            firebase
            .firestore()
            .collection("users")
            .doc(doc.id)
            .update(details)
        })
    },
    handleMarkerLost:function(){
        var buttondiv = document.getElementById("button-div")
        buttondiv.style.display = "none";
    },
    getToys: async function(){
        return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
            return snap.docs.map(doc => doc.data());
        })
    },
})