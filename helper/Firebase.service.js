const firebase = require('firebase')

function setData(payload, parent, child) {
    firebase.database().ref(parent).child(child).set({ ...payload })
}

function updateData(payload, parent, child) {
    firebase.database().ref(parent).child(child).update({ ...payload })
}

module.exports = {
    setData,
    updateData,
}