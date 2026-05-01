import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://sierra-lure-gear.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# Root/categories
def test_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    d = r.json()
    assert d.get("status") == "ok"


def test_categories(s):
    r = s.get(f"{API}/categories")
    assert r.status_code == 200
    d = r.json()
    assert d["categories"] == ["Fishing Shirts", "Patriotic Graphics", "Outdoor Lifestyle"]
    assert "S" in d["sizes"] and "XXL" in d["sizes"]


# Products
def test_list_products_seeded(s):
    r = s.get(f"{API}/products")
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 4
    p = data[0]
    for k in ["id", "name", "category", "price", "image_url", "sizes", "featured"]:
        assert k in p


def test_products_filter_category(s):
    r = s.get(f"{API}/products", params={"category": "Fishing Shirts"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    assert all(p["category"] == "Fishing Shirts" for p in data)


def test_products_featured(s):
    r = s.get(f"{API}/products", params={"featured": "true"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 4
    assert all(p["featured"] is True for p in data)


def test_get_product_by_id_and_404(s):
    r_all = s.get(f"{API}/products").json()
    pid = r_all[0]["id"]
    r = s.get(f"{API}/products/{pid}")
    assert r.status_code == 200
    assert r.json()["id"] == pid

    r2 = s.get(f"{API}/products/nonexistent-xyz")
    assert r2.status_code == 404


def test_create_update_delete_product(s):
    # Create
    payload = {
        "name": "TEST_Shirt",
        "description": "test",
        "category": "Fishing Shirts",
        "price": 19.99,
        "image_url": "https://example.com/img.png",
        "featured": False,
    }
    r = s.post(f"{API}/products", json=payload)
    assert r.status_code == 200
    created = r.json()
    assert created["name"] == "TEST_Shirt"
    assert created["price"] == 19.99
    pid = created["id"]

    # verify persisted
    g = s.get(f"{API}/products/{pid}")
    assert g.status_code == 200
    assert g.json()["name"] == "TEST_Shirt"

    # Update
    u = s.put(f"{API}/products/{pid}", json={"price": 29.99, "featured": True})
    assert u.status_code == 200
    assert u.json()["price"] == 29.99
    assert u.json()["featured"] is True

    # GET verify persistence
    g2 = s.get(f"{API}/products/{pid}").json()
    assert g2["price"] == 29.99
    assert g2["featured"] is True

    # Delete
    d = s.delete(f"{API}/products/{pid}")
    assert d.status_code == 200

    # Verify gone
    g3 = s.get(f"{API}/products/{pid}")
    assert g3.status_code == 404

    # Delete unknown
    d2 = s.delete(f"{API}/products/nope-xyz")
    assert d2.status_code == 404


def test_create_product_invalid_category(s):
    payload = {
        "name": "TEST_Invalid",
        "category": "BadCat",
        "price": 10,
        "image_url": "http://x/y.png",
    }
    r = s.post(f"{API}/products", json=payload)
    assert r.status_code == 400


# Orders
def _shipping():
    return {
        "full_name": "Test User",
        "email": "test@example.com",
        "address": "1 Main St",
        "city": "Bishop",
        "state": "CA",
        "zip_code": "93514",
        "country": "USA",
    }


def test_order_small_subtotal_with_shipping_and_tax(s):
    items = [{
        "product_id": "p1", "name": "Shirt", "price": 34.99, "image_url": "x", "size": "M", "quantity": 1
    }]
    payload = {"items": items, "shipping": _shipping(), "payment_method": "card"}
    r = s.post(f"{API}/orders", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["subtotal"] == 34.99
    assert d["shipping_cost"] == 7.99
    assert d["tax"] == round(34.99 * 0.08, 2)
    assert d["total"] == round(34.99 + 7.99 + round(34.99 * 0.08, 2), 2)
    assert d["order_number"].startswith("NL-")


def test_order_free_shipping_over_75(s):
    items = [{
        "product_id": "p1", "name": "Shirt", "price": 34.99, "image_url": "x", "size": "M", "quantity": 3
    }]
    payload = {"items": items, "shipping": _shipping(), "payment_method": "paypal"}
    r = s.post(f"{API}/orders", json=payload)
    assert r.status_code == 200
    d = r.json()
    sub = round(34.99 * 3, 2)
    assert d["subtotal"] == sub
    assert d["shipping_cost"] == 0.0
    assert d["tax"] == round(sub * 0.08, 2)


def test_order_empty_items_400(s):
    payload = {"items": [], "shipping": _shipping()}
    r = s.post(f"{API}/orders", json=payload)
    assert r.status_code == 400


# Contact
def test_contact_message(s):
    payload = {"name": "TEST_John", "email": "john@example.com", "subject": "Hi", "message": "Hello"}
    r = s.post(f"{API}/contact", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["name"] == "TEST_John"
    assert "id" in d
