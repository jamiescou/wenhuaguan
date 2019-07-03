export default function({ store, redirect, route, router }) {
    if (!store.state.user || !store.state.user.id) {
        return redirect('/login?redirect=' + route.fullPath)
    }
}
