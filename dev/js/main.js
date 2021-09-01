window.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://fakestoreapi.com/';

    const productsElement = document.getElementById('products');
    const shoppingCartIcon = document.getElementById('shopping-cart-icon');
    const openShoppingCartBtn = document.getElementById('open-cart-btn');
    const shoppingCartModal = document.getElementById('shopping-cart-modal');

    async function getProducts() {
        let productsResponse = await fetch(`${apiUrl}products`);
        let products = await productsResponse.json();

        let categoriesResponse = await fetch(`${apiUrl}products/categories`);
        let categories = await categoriesResponse.json();

        return {
            products: products,
            categories: categories
        };
    }

    const productsByCategory = {};
    const shoppingCartArray = localStorage.getItem('shoppingCart')
        ? JSON.parse(localStorage.getItem('shoppingCart'))
        : [];
    changeCountInShoppingCart();

    getProducts().then(data => {
        data.categories.forEach(category => {
            productsByCategory[category] = filterProductsByCategory(data.products, category);
        });
        displayProductsByCategory(productsByCategory);
    });

    function filterProductsByCategory(productsArray, category) {
        return productsArray.filter(product => product.category === category)
    }

    function displayProductsByCategory(productsByCategory) {
        for (let categoryName in productsByCategory) {
            let title = document.createElement('h3');
            title.innerText = categoryName.toUpperCase();
            title.classList.add('products__category');
            let list = document.createElement('ul');
            productsElement.appendChild(title);
            productsElement.appendChild(list);

            productsByCategory[categoryName].forEach(product => {
                let listItem = document.createElement('li');
                listItem.classList.add('product');
                listItem.innerHTML = `<a href="#"><span>${product.title} - <b>$${product.price}</b></span></a>
                                  <div>
                                        <button type="button" class="button button_add">+</button>
                                        <button type="button" class="button button_remove">-</button>
                                  </div>`;
                list.appendChild(listItem);
                let addButton = listItem.querySelector('.button_add');
                addButton.addEventListener('click', () => addProductToShoppingCart(product, shoppingCartArray));
                let removeButton = listItem.querySelector('.button_remove');
                removeButton.addEventListener('click', () => removeProductToShoppingCart(product, shoppingCartArray));
            })
        }
    }

    function addProductToShoppingCart(product, array) {
        saveProduct();
        changeCountInShoppingCart();
        array.push(product);
    }

    function removeProductToShoppingCart(product, array) {
        let itemToDeleteIndex = array.reverse().findIndex(item => item.id === product.id);
        if (itemToDeleteIndex > -1) array.splice(itemToDeleteIndex, 1);
        array.reverse();
        saveProduct();
        changeCountInShoppingCart();
    }

    function saveProduct() {
        localStorage.setItem('shoppingCart', JSON.stringify(shoppingCartArray))
    }

    // const groupProductsById = (products, key) => products.reduce((result, product) => ({
    //     ...result, [product[key]]: [...(result[product[key]] || []), product]}), {}
    // );

    // console.log(groupProductsById(shoppingCartArray, 'id'));

    function changeCountInShoppingCart() {
        if (shoppingCartArray.length > 0) {
            shoppingCartIcon.classList.add('header__shopping-length_visible');
            shoppingCartIcon.innerText = shoppingCartArray.length.toString();
        } else {
            shoppingCartIcon.classList.remove('header__shopping-length_visible');
        }
    }

    openShoppingCartBtn.addEventListener('click', openShoppingCartModal);
    shoppingCartModal.addEventListener('blur', closeShoppingCartModal);

    function openShoppingCartModal() {
        shoppingCartModal.classList.add('modal_visible');
        document.body.classList.add('modal-open');
        passSelectedProductsToModal(shoppingCartArray);
    }

    function closeShoppingCartModal(event) {
        console.log(event);
    }

    function passSelectedProductsToModal(array) {
        const list = document.createElement('ul');
        let id = 0;
        let count = 0;
        let listItem;
        array.forEach(product => {
            if (product.id !== id) {
                count = 1;
                listItem = document.createElement('li');
                listItem.classList.add('product');
                listItem.innerHTML = `<a href="#"><span>${product.id} ${product.title} - <b id="sum">$${product.price * count}</b></span>
                                        <span id="count">(${count})</span>
                                      </a>
                                  <div>
                                        <button type="button" class="button button_add">+</button>
                                        <button type="button" class="button button_remove">-</button>
                                  </div>`;
                list.appendChild(listItem);
                id = product.id;
            } else {
                count++;
                listItem.querySelector('#count').innerText = `(${count})`;
                listItem.querySelector('#sum').innerText = `$${product.price * count}`;
            }
            let addButton = listItem.querySelector('.button_add');
            addButton.addEventListener('click', () => incrementProductCount(product, shoppingCartArray));
            let removeButton = listItem.querySelector('.button_remove');
            removeButton.addEventListener('click', () => decrementProductCount(product, shoppingCartArray));
        });
        document.getElementById('shopping-cart-modal-content').append(list);
    }

    function incrementProductCount(product, array, listItem) {
        // const count = listItem.querySelector('#count').textContent;
        // console.log(listItem);
    }
});
