AFRAME.registerComponent("create-markers",{
    init:async function(){
        var mainscene = document.querySelector("#main-scene")
        var toys = await this.getToys()
        toys.map(toy => {
            var marker = document.createElement("a-marker")
            marker.setAttribute("id",toy.id)
            marker.setAttribute("type","pattern")
            marker.setAttribute("url",toy.marker_pattern_url)
            marker.setAttribute("cursor",{rayOrigin: "mouse"})
            marker.setAttribute("marker-handler",{})
            mainscene.appendChild(marker)

            if(!toy.out_of_stock)
             {
            //Adding 3d model to the scene
            var model = document.createElement("a-entity")
            model.setAttribute("id",`model-${toy.id}`)
            model.setAttribute("position",toy.model_geometry.position)
            model.setAttribute("rotation",toy.model_geometry.rotation)
            model.setAttribute("scale",toy.model_geometry.scale)
            model.setAttribute("gltf-model",`url(${toy.model_url})`)
            model.setAttribute("gesture-handler",{})
            model.setAttribute("animation-mixer",{})
            model.setAttribute("visible",false);
            marker.appendChild(model)

            //description
            var mainPlane = document.createElement("a-plane")
            mainPlane.setAttribute("id",`main-plane-${toy.id}`)
            mainPlane.setAttribute("position",{x: 0, y: 0 , z: 0})
            mainPlane.setAttribute("rotation",{x: -90 , y: 0, z: 0})
            mainPlane.setAttribute("material",{color: "FFD880"})
            mainPlane.setAttribute("width",2.3)
            mainPlane.setAttribute("height",2.5)
            mainPlane.setAttribute("visible", false);
            marker.appendChild(mainPlane)

            //toy title bg plane
            var titlePlane = document.createElement("a-plane")
            titlePlane.setAttribute("id",`toy-title-${toy.id}`)
            titlePlane.setAttribute("position",{x: 0, y: 0.89 , z: 0.02})
            titlePlane.setAttribute("rotation",{x: 0 , y: 0 , z: 0})
            titlePlane.setAttribute("width",2.31)
            titlePlane.setAttribute("height",0.4)
            titlePlane.setAttribute("material", {color: "#F0C30F"} )
            mainPlane.appendChild(titlePlane)

            //Toy title
            var toyTitle = document.createElement("a-entity")
            toyTitle.setAttribute("id",`toy-title-${toy.id}`)
            toyTitle.setAttribute("position",{x: 0 , y: 0 , z: 0.1})
            toyTitle.setAttribute("rotation",{x: 0,y: 0,z: 0})
            toyTitle.setAttribute("text",{font: "aileronsemibold", color: "#290149", width: 4.5 , height: 3 , align: "left" , value: toy.toy_name.toUpperCase()})
            titlePlane.appendChild(toyTitle)

            //description list
            var description = document.createElement("a-entity")
            description.setAttribute("id",`description-${toy.id}`)
            description.setAttribute("position",{ x: 0.03 , y: 0 , z: 0.1})
            description.setAttribute("rotation",{ x: 0 , y: 0 , z: 0})
            description.setAttribute("text",{font: "dejavu", color: "#6b011f", width: 2 , height: 2 , letterSpacing: 2 , lineHeight: 50 , value: `${toy.description}`})
            mainPlane.appendChild(description)


            // plane to show price
            var pricePlane = document.createElement("a-plane")
            pricePlane.setAttribute("id",`price-plane${toy.id}`)
            pricePlane.setAttribute("src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png")
            pricePlane.setAttribute("position",{ x: -1.3, y: 0, z: 0.3})
            pricePlane.setAttribute("rotation",{ x: -90, y: 0, z: 0})
            pricePlane.setAttribute("visible", false)
            mainPlane.appendChild(pricePlane)

            //actual price
            var price = document.createElement("a-entity")
            price.setAttribute("id",`price-${toy.id}`)
            price.setAttribute("position",{ x: 0.03, y: 0, z: 0})
            price.setAttribute("text",{
                font: "mozillavr",
                color: "white",
                width: 3,
                align: "center",
                value: `ONLY\n $${toy.price}`
            })
            pricePlane.appendChild(price)

            }

        })
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