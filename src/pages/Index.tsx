import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: number;
  title: string;
  game: string;
  price: number;
  seller: string;
  sellerRating: number;
  image: string;
  description: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все игры');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSeller, setChatSeller] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'seller', time: string}[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessages, setSupportMessages] = useState<{text: string, sender: 'user' | 'support', time: string}[]>([]);
  const [supportInput, setSupportInput] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<{product: string, price: number, date: string, seller: string}[]>([]);

  const categories = ['Все игры', 'CS:GO', 'GTA V', 'Minecraft', 'Roblox', 'Standoff 2'];

  const products: Product[] = userProducts;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.game.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все игры' || product.game === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-primary">GameMarket</h1>
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск игровых предметов..."
                  className="pl-10 pr-4 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Plus" size={18} />
                    Создать товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать новый товар</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о товаре для продажи
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-title">Название товара</Label>
                      <Input id="product-title" placeholder="Например: AWP | Dragon Lore" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-game">Игра</Label>
                      <Input id="product-game" placeholder="Например: CS:GO" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-price">Цена (₽)</Label>
                      <Input id="product-price" type="number" placeholder="1000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-description">Описание</Label>
                      <Textarea id="product-description" placeholder="Опишите ваш товар..." rows={4} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-image">Изображение товара</Label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input 
                            id="product-image" 
                            type="file" 
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImageFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setImagePreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        {imagePreview && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                            <img 
                              src={imagePreview} 
                              alt="Предпросмотр" 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setImagePreview('');
                                setImageFile(null);
                                const input = document.getElementById('product-image') as HTMLInputElement;
                                if (input) input.value = '';
                              }}
                            >
                              <Icon name="X" size={18} />
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">Поддерживаются форматы: JPG, PNG, GIF (макс. 5 МБ)</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => {
                      const title = (document.getElementById('product-title') as HTMLInputElement)?.value;
                      const game = (document.getElementById('product-game') as HTMLInputElement)?.value;
                      const price = parseInt((document.getElementById('product-price') as HTMLInputElement)?.value || '0');
                      const description = (document.getElementById('product-description') as HTMLTextAreaElement)?.value;
                      
                      if (title && game && price && imagePreview) {
                        const newProduct: Product = {
                          id: Date.now(),
                          title,
                          game,
                          price,
                          seller: username,
                          sellerRating: 5.0,
                          image: imagePreview,
                          description
                        };
                        setUserProducts([...userProducts, newProduct]);
                        setIsAddProductOpen(false);
                        setImagePreview('');
                        setImageFile(null);
                      }
                    }}>
                      Создать товар
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setIsSupportOpen(true)}
              >
                <Icon name="HeadphonesIcon" size={18} />
                Поддержка
              </Button>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowProfile(!showProfile)}
                  >
                    <Icon name="User" size={18} />
                    {username}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setUsername('');
                      setShowProfile(false);
                      setUserProducts([]);
                      setPurchaseHistory([]);
                    }}
                  >
                    <Icon name="LogOut" size={18} />
                  </Button>
                </div>
              ) : (
                <Button 
                  className="gap-2"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                >
                  <Icon name="User" size={18} />
                  Войти
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showProfile && isLoggedIn ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Личный кабинет</h2>
              <Button variant="outline" onClick={() => setShowProfile(false)}>
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Вернуться к каталогу
              </Button>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="User" size={24} />
                    Профиль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xl font-bold">{username}</p>
                      <p className="text-sm text-gray-600">Продавец на платформе</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Package" size={24} />
                    Мои товары ({userProducts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProducts.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">У вас пока нет товаров</p>
                  ) : (
                    <div className="grid gap-4">
                      {userProducts.map((product) => (
                        <div key={product.id} className="flex gap-4 border rounded-lg p-4">
                          <img src={product.image} alt={product.title} className="w-24 h-24 object-cover rounded" />
                          <div className="flex-1">
                            <h3 className="font-bold">{product.title}</h3>
                            <p className="text-sm text-gray-600">{product.game}</p>
                            <p className="text-lg font-bold text-primary mt-2">{product.price.toLocaleString('ru-RU')} ₽</p>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => setUserProducts(userProducts.filter(p => p.id !== product.id))}
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="ShoppingBag" size={24} />
                    История покупок ({purchaseHistory.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {purchaseHistory.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Вы пока ничего не купили</p>
                  ) : (
                    <div className="space-y-3">
                      {purchaseHistory.map((purchase, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <p className="font-medium">{purchase.product}</p>
                            <p className="text-sm text-gray-600">Продавец: {purchase.seller}</p>
                            <p className="text-xs text-gray-500">{purchase.date}</p>
                          </div>
                          <p className="font-bold text-primary">{purchase.price.toLocaleString('ru-RU')} ₽</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Маркетплейс игровых предметов</h2>
              <p className="text-gray-600">Покупайте и продавайте игровые предметы безопасно</p>
            </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="PackageX" className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-white text-primary border border-primary">
                    {product.game}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {product.seller.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.seller}</p>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-600">{product.sellerRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 gap-2">
                        <Icon name="CreditCard" size={18} />
                        Купить
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Оплата товара</DialogTitle>
                        <DialogDescription>
                          {product.title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium">Итого к оплате:</span>
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Icon name="Info" className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-blue-900">
                                Переведите {product.price.toLocaleString('ru-RU')} ₽ на карту:
                              </p>
                              <div className="flex items-center gap-2 bg-white rounded-md p-3 border border-blue-200">
                                <span className="font-mono text-lg font-bold text-gray-900">
                                  2202 2067 5930 1174
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    navigator.clipboard.writeText('2202206759301174');
                                  }}
                                >
                                  <Icon name="Copy" size={16} />
                                </Button>
                              </div>
                              <p className="text-xs text-blue-700">
                                После перевода нажмите кнопку "Подтвердить оплату" ниже
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-comment">Комментарий к переводу (необязательно)</Label>
                          <Input 
                            id="payment-comment" 
                            placeholder="Ваше имя или номер заказа" 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          className="w-full gap-2"
                          onClick={() => {
                            setPurchaseHistory([
                              ...purchaseHistory,
                              {
                                product: product.title,
                                price: product.price,
                                date: new Date().toLocaleDateString('ru-RU'),
                                seller: product.seller
                              }
                            ]);
                            setChatSeller(product.seller);
                            setChatMessages([
                              {
                                text: `Здравствуйте! Я оплатил товар "${product.title}" переводом на карту 2202 2067 5930 1174. Как получить покупку?`,
                                sender: 'user',
                                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                              }
                            ]);
                            setIsChatOpen(true);
                          }}
                        >
                          <Icon name="ShieldCheck" size={18} />
                          Подтвердить оплату
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon">
                    <Icon name="Heart" size={18} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Gamepad2" className="text-white" size={20} />
                </div>
                <span className="font-bold text-lg">GameMarket</span>
              </div>
              <p className="text-sm text-gray-600">
                Безопасная платформа для покупки и продажи игровых предметов
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Каталог</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>CS:GO предметы</li>
                <li>Dota 2 предметы</li>
                <li>Rust предметы</li>
                <li>GTA V предметы</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Помощь</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Как купить</li>
                <li>Как продать</li>
                <li>Гарантии</li>
                <li>Поддержка</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Контакты</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  support@gamemarket.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  Онлайн чат
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
            © 2024 GameMarket. Все права защищены.
          </div>
        </div>
      </footer>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-white">
                  {chatSeller.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>Чат с {chatSeller}</DialogTitle>
                <DialogDescription>Продавец онлайн</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Напишите сообщение..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && messageInput.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      {
                        text: messageInput,
                        sender: 'user',
                        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                    setMessageInput('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (messageInput.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      {
                        text: messageInput,
                        sender: 'user',
                        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                    setMessageInput('');
                  }
                }}
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login' 
                ? 'Введите свои данные для входа' 
                : 'Создайте новый аккаунт на платформе'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {authMode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input 
                  id="reg-username" 
                  placeholder="Ваш ник на платформе"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input 
                id="auth-email" 
                type="email" 
                placeholder="example@mail.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auth-password">Пароль</Label>
              <Input 
                id="auth-password" 
                type="password" 
                placeholder="••••••••"
                required
              />
            </div>

            {authMode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="auth-password-confirm">Подтвердите пароль</Label>
                <Input 
                  id="auth-password-confirm" 
                  type="password" 
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-3">
            <Button 
              className="w-full"
              onClick={() => {
                const usernameInput = authMode === 'register' 
                  ? (document.getElementById('reg-username') as HTMLInputElement)?.value 
                  : (document.getElementById('auth-email') as HTMLInputElement)?.value.split('@')[0];
                
                if (usernameInput) {
                  setUsername(usernameInput);
                  setIsLoggedIn(true);
                  setIsAuthOpen(false);
                }
              }}
            >
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <div className="text-center text-sm">
              {authMode === 'login' ? (
                <p className="text-gray-600">
                  Нет аккаунта?{' '}
                  <button
                    className="text-primary font-medium hover:underline"
                    onClick={() => setAuthMode('register')}
                  >
                    Зарегистрируйтесь
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Уже есть аккаунт?{' '}
                  <button
                    className="text-primary font-medium hover:underline"
                    onClick={() => setAuthMode('login')}
                  >
                    Войдите
                  </button>
                </p>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="HeadphonesIcon" className="text-white" size={20} />
              </div>
              <div>
                <DialogTitle>Поддержка GameMarket</DialogTitle>
                <DialogDescription>Мы онлайн и готовы помочь</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {supportMessages.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="MessageCircle" className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-lg font-semibold mb-2">Чат поддержки</h3>
                <p className="text-gray-600">Опишите вашу проблему, и мы поможем её решить</p>
              </div>
            ) : (
              supportMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                placeholder="Опишите вашу проблему..."
                value={supportInput}
                onChange={(e) => setSupportInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && supportInput.trim()) {
                    setSupportMessages([
                      ...supportMessages,
                      {
                        text: supportInput,
                        sender: 'user',
                        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                    setSupportInput('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (supportInput.trim()) {
                    setSupportMessages([
                      ...supportMessages,
                      {
                        text: supportInput,
                        sender: 'user',
                        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                    setSupportInput('');
                  }
                }}
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Администратор увидит ваше сообщение и ответит в ближайшее время
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;